import Trip from "../models/tripModel.js";
import User from "../models/userModel.js";


// Create Trip
export const createTrip = async (req, res) => {
  try {
    const {
      userId,
      carType,
      passengerNo,
      luggageNo,
      currentLocation,
      destination,
      scheduledAt
    } = req.body;

    const isScheduled = scheduledAt && new Date(scheduledAt) > new Date();
    const status = isScheduled ? "Scheduled" : "Requested";

    const trip = await Trip.create({
      userId,
      carType,
      passengerNo,
      luggageNo,
      currentLocation,
      destination,
      scheduledAt: isScheduled ? new Date(scheduledAt) : null,
      status,
      paymentInfo: {
        method: "Cash",
        status: "Pending"
      }
    });

    res.status(201).json({ trip });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get All Trips
export const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find().populate('userId').populate('driverId');
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Trip
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('userId').populate('driverId');
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.status(200).json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Trip
export const updateTrip = async (req, res) => {
  try {
    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTrip) return res.status(404).json({ message: "Trip not found" });
    res.status(200).json(updatedTrip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Trip
export const deleteTrip = async (req, res) => {
  try {
    const deleted = await Trip.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Trip not found" });
    res.status(200).json({ message: "Trip deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// cancel trip
export const cancelTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // منع الإلغاء المتكرر خلال 2 يوم:
    const now = new Date();
    const lastCanceledTrip = await Trip.findOne({
      userId: trip.userId,
      status: "Cancelled",
      scheduledAt: { $gte: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) }
    });

    if (lastCanceledTrip) {
      return res.status(400).json({ message: "You can't cancel again within 2 days." });
    }

    trip.status = "Cancelled";
    await trip.save();

    res.json({ message: "Trip cancelled successfully", trip });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// complete trip 

export const completeTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findById(id);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    trip.status = "Completed";
    trip.endTime = new Date();
    await trip.save();

    res.status(200).json({ message: "Trip completed", trip });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// rate the trip 

export const rateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, blockDriver } = req.body;

    const trip = await Trip.findById(id).populate('driverId');
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    trip.rating = rating;
    trip.feedback = comment || "";
    trip.blockedDriver = !!blockDriver;

    await trip.save();

    if (blockDriver) {
      const user = await User.findById(trip.userId);
      if (!user.blockedDrivers.includes(trip.driverId._id)) {
        user.blockedDrivers.push(trip.driverId._id);
        await user.save();
      }
    }

    res.status(200).json({ message: "Trip rated", trip });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

