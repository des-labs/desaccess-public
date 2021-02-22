--
-- Example Query --
-- This query selects  a sample of bright galaxies
SELECT dr2.RA RA, dr2.DEC DEC, dr2.COADD_OBJECT_ID ID
FROM DR2_MAIN sample(0.01) dr2
WHERE
  dr2.MAG_AUTO_G < 18 and
  dr2.WAVG_SPREAD_MODEL_I + 3.0*dr2.WAVG_SPREADERR_MODEL_I > 0.005 and
  dr2.WAVG_SPREAD_MODEL_I + 1.0*dr2.WAVG_SPREADERR_MODEL_I > 0.003 and
  dr2.WAVG_SPREAD_MODEL_I - 1.0*dr2.WAVG_SPREADERR_MODEL_I > 0.001 and
  dr2.WAVG_SPREAD_MODEL_I > -1 and
  dr2.IMAFLAGS_ISO_G = 0 and
  dr2.IMAFLAGS_ISO_R = 0 and
  dr2.IMAFLAGS_ISO_I = 0 and
  dr2.FLAGS_G < 4 and
  dr2.FLAGS_R < 4 and
  dr2.FLAGS_I < 4 and
  dr2.NEPOCHS_G > 0 and
  dr2.NEPOCHS_R > 0 and
  dr2.NEPOCHS_I > 0
