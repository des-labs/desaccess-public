--
-- Example Query --
-- This query creates a Healpix map of number of stars
-- and their mean magnitude on a resolution of NSIDE = 1024
-- using NEST Schema and a sample of our full DR2 database table
SELECT
count(main.MAG_AUTO_I) COUNT,
main.HPIX_1024
FROM DR2_MAIN_SAMPLE main
WHERE
  main.WAVG_SPREAD_MODEL_I + 3.0*main.WAVG_SPREADERR_MODEL_I < 0.005 and
  main.WAVG_SPREAD_MODEL_I > -1 and
  main.IMAFLAGS_ISO_I = 0 and
  main.MAG_AUTO_I < 21
GROUP BY main.HPIX_1024
