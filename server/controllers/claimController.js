const Claim = require("../models/Claim");

// Get Claims
exports.getClaims = async (req, res) => {
  try {
    let claims;

    if (req.user.role == "patient") {
      claims = await Claim.find({ patientId: req.user.id });
    } else {
      claims = await Claim.find();
    }

    return res.status(200).json({
      success: true,
      count: claims.length,
      data: claims,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Claim
exports.getClaim = async (req, res) => {
  try {
    const claims = await Claim.find({ patientId: req.params.id });

    if (!claims.length) {
      return res.status(404).json({
        success: false,
        message: `No claims found for patient ID ${req.params.id}`,
      });
    }

    if (req.user.role === "patient" && claims[0].patientId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to access this claim`,
      });
    }

    return res.status(200).json({
      success: true,
      data: claims,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// Create Claim
exports.createClaim = async(req, res) => {
    try {
        req.body.patientId = req.user.id;
        req.body.patientName = req.user.name;
        req.body.patientEmail = req.user.email;
        req.body.status = 'pending';

        const claim = await Claim.create(req.body);

        return res.status(201).json({
            success: true,
            data: claim
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

// Update Claim
exports.updateClaim = async (req, res) => {
    try {
        let claim = await Claim.findById(req.params.id);

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: `Claim not found with id of ${req.params.id}`
            });
        }

        if (req.user.role === 'patient' && claim.patientId !== req.user.id ) {
            return res.status(403).json({
                success: false,
                message: `User ${user.params.id} is not authorized to update this claim`
            });
        }
        if (req.user.role === 'insurer' && req.body.status) {
            req.body.reviewedBy = req.user.id;
        }

        claim = await Claim.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({
            success: true,
            data: claim
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}