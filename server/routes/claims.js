const express = require('express');
const {
  getClaims,
  getClaim,
  createClaim,
  updateClaim
} = require('../controllers/claimController');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getClaims)
  .post(protect, authorize('patient'), createClaim);

router
  .route('/:id')
  .get(protect, getClaim)
  .put(protect, updateClaim);

module.exports = router;
