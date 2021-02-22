--
-- Example Query --
-- This query selects stars around the center of glubular cluster M2
SELECT
  COADD_OBJECT_ID,RA,DEC,
  MAG_AUTO_G G,
  MAG_AUTO_R R,
  WAVG_MAG_PSF_G G_PSF,
  WAVG_MAG_PSF_R R_PSF
FROM Y3_GOLD_2_2
WHERE
  RA between 323.36-0.12 and 323.36+0.12 and
  DEC between -0.82-0.12 and -0.82+0.12 and
  WAVG_SPREAD_MODEL_I + 3.0*WAVG_SPREADERR_MODEL_I < 0.005 and
  WAVG_SPREAD_MODEL_I > -1 and
  IMAFLAGS_ISO_G = 0 and
  IMAFLAGS_ISO_R = 0 and
  SEXTRACTOR_FLAGS_G < 4 and
  SEXTRACTOR_FLAGS_R < 4
