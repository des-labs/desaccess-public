--
-- Example Query --
-- This query creates a Healpix map of number of high confidence galaxies
-- and their mean magnitude on a resolution of NSIDE = 1024
-- using NEST Schema and a sample of our full DR2 database table
SELECT count(dr2.MAG_AUTO_I) COUNT,avg(dr2.MAG_AUTO_I) AVERAGE,dr2.HPIX_1024
FROM DR2_MAIN_SAMPLE dr2
WHERE
  dr2.MAG_AUTO_I < 23 AND
  dr2.EXTENDED_CLASS_COADD=3
GROUP BY dr2.HPIX_1024
