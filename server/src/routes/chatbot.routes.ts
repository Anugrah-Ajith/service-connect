import express from 'express';
import { body } from 'express-validator';

const router = express.Router();

// Simple chatbot endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const lowerMessage = message.toLowerCase();

    // Simple keyword-based responses
    let response = '';

    if (lowerMessage.includes('plumber') || lowerMessage.includes('plumbing')) {
      response = 'I can help you find a plumber! Common services include leak repairs, pipe installation, drain cleaning, and fixture installation. Would you like to browse available plumbers?';
    } else if (lowerMessage.includes('electrician') || lowerMessage.includes('electrical')) {
      response = 'I can help you find an electrician! Services include wiring, panel upgrades, outlet installation, and electrical repairs. Would you like to see available electricians?';
    } else if (lowerMessage.includes('mechanic') || lowerMessage.includes('car') || lowerMessage.includes('vehicle')) {
      response = 'I can help you find a mechanic! Services include oil changes, brake repairs, engine diagnostics, and general maintenance. Would you like to find a mechanic near you?';
    } else if (lowerMessage.includes('carpenter') || lowerMessage.includes('carpentry')) {
      response = 'I can help you find a carpenter! Services include furniture building, repairs, installations, and custom woodwork. Would you like to browse carpenters?';
    } else if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      response = 'For emergencies, we have an emergency repair option that prioritizes urgent requests. Would you like to create an emergency service request?';
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate')) {
      response = 'Pricing varies by service provider and is based on hourly rates. Rates typically range from $30-$100 per hour depending on the service type and experience level. You can see exact rates when viewing provider profiles.';
    } else if (lowerMessage.includes('verified') || lowerMessage.includes('trust') || lowerMessage.includes('safe')) {
      response = 'All service providers go through a verification process including background checks and certification validation. You can also read reviews from previous customers to make an informed decision.';
    } else {
      response = 'I\'m here to help you find skilled service providers! I can assist with finding plumbers, electricians, mechanics, carpenters, and more. What service do you need today?';
    }

    res.json({ response });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

