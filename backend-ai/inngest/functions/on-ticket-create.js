import { NonRetriableError } from "inngest";
import { inngest } from "../client.js";
import Ticket from "../../models/ticket.model.js";
import analyzeTicket from "../../utils/ai.agent.js";
import User from "../../models/user.model.js";

export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  { event: "ticket/created" },
  async ({ event, step }) => {
    try {
      const { ticketId } = event.data;
      //fetch ticket from db
      const ticket = await step.run("fetch-ticket", async () => {
        const ticketObject = await Ticket.findById(ticketId);
        if (!ticketObject) {
          throw new NonRetriableError("Ticket is not found");
        }
        return ticketObject;
      });

      await step.run("update-ticket-status", async () => {
        await Ticket.findByIdAndUpdate(ticket._id, {
          status: "TODO",
        });
      });

      const aiResponse = await analyzeTicket(ticket);

      const relatedSkills = await step.run("ai-processing", async () => {
        let skils = [];
        if (aiResponse) {
          await Ticket.findByIdAndUpdate(ticket._id, {
            priority: !["low", "medium", "high"].includes(aiResponse.priority)
              ? "medium"
              : aiResponse.priority,
            helpfulNotes: aiResponse.helpfulNotes,
            status: "IN_PROGRESS",
            relatedSkills: aiResponse.relatedSkills,
          });
          skils = aiResponse.relatedSkills;
        }
        return skils;
      });

      const moderator = await step.run("assign-moderator", async () => {
        let user = await User.findOne({
          role: "moderator",
          skils: {
            $elemMatch: {
              $regex: relatedSkills.join("|"),
              $options: "i",
            },
          },
        });
        if (!user) {
          user = await User.findOne({
            role: "admin",
          });
        }
        await Ticket.findByIdAndUpdate(ticket._id, {
          assignedTo: user?._id || null,
        });
        return user;
      });

      return {success : true}
    } catch (error) {
        console.error(`Error:${error.message}`)
    }
  }
);
