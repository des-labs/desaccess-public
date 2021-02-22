--
-- Example Query --
-- This query selects 0.001% of the data and returns only five rows
SELECT 
  RA, DEC, MAG_AUTO_G, TILENAME
FROM DR2_MAIN sample(0.001)
FETCH FIRST 5 ROWS ONLY
  