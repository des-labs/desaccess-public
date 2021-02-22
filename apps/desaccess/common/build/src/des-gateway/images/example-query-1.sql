--
-- Example Query --
-- This query selects the first 1000 rows from a RA/DEC region
SELECT ALPHAWIN_J2000 RAP,DELTAWIN_J2000 DECP, MAG_AUTO_G, TILENAME
FROM Y3_GOLD_2_2
WHERE
  RA BETWEEN 40.0 and 41.0 and
  DEC BETWEEN -41 and -40 and
  ROWNUM < 1001
