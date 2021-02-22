API Documentation
--------------------------------------

Everything you can do on the DESaccess website can also be done by an external client app using the DESaccess API. 

.. note:: 
  **See the** `API documentation <api/>`_ **to explore the API in detail and to optionally download the specification in OpenAPI format**.

.. _cutout-service-api-details:

Cutout service API
^^^^^^^^^^^^^^^^^^^^^^^^^^

In order to support the maximum flexibility for configuring each cutout,
while maintaining a simplicity of configuration when fine-grained
control is not required, there are three levels of configuration that
are hierarchically applied to each job request. 

1. First, the system defaults are applied. 
2. Second, the user-supplied global options are applied, overriding the system defaults when provided. 
3. Finally, the per-cutout options are applied, overriding the system and user-supplied global options when present.

Example
'''''''''''''''''''''''''''''

Consider this example, which uses Python syntax for the sake of
familiarity:

You submit a request that includes the “global” options::

   {
     "db": "DESDR",
     "release": "DR1",
     "positions": position_table,
     "make_rgb_stiff": true,
   }

and your positions table ``position_table`` looks like this, where you
specify two cutout requests using five columns of parameters::

          RA ,       DEC , MAKE_FITS , COLORS_FITS , RGB_STIFF_COLORS
   21.588130 ,   3.48611 ,           ,           z ,                 
   46.275669 , -34.25900 ,     false ,             ,          izy;grz 

(Spaces included here for legibility even though it is not valid CSV
format to have spaces between commas and values.)

**First cutout**: The request lacks a value for ``make_fits`` in the
table, and there is no user-supplied global value, so the system default
value of ``true`` is applied. Thus, a z-band FITS file is generated.
Although the system default value for ``make_rgb_stiff = false``, this
is overridden by the user-supplied global value
``make_rgb_stiff = true``, so a STIFF RGB image is produced. Since no
cutout-specific nor user-supplied global value of ``rgb_stiff_colors``
is provided, the system default value of ``gri`` is applied, so one
STIFF RGB image with ``red/green/blue = g/r/i`` is generated.

**Second cutout**: The cutout-specific ``make_fits = false`` is applied,
so no FITS file is generated. Although the system default value for
``make_rgb_stiff = false``, this is overridden by the user-supplied
global value ``make_rgb_stiff = true``, so a STIFF RGB image is
produced. The cutout-specific value of ``rgb_stiff_colors = izy;grz``
overrides the system default ``gri``, so two STIFF RGB images with
``red/green/blue = i/z/y`` and ``red/green/blue = g/r/z`` are generated.

System default values
'''''''''''''''''''''''''''''

The system default values applied in the absence of user-specified values are shown below, along with explanations of the parameters ::

  ####################################################################
  # Parameters that can be overridden by user-specified configuration
  #
  # CSV-formatted file containing table of (optionally individually configured) 
  # cutout positions. This example shows all possible columns you can include:
  #
  #     RA,DEC,COADD_OBJECT_ID,XSIZE,YSIZE,COLORS_FITS,RGB_STIFF_COLORS,RGB_LUPTON_COLORS,RGB_MINIMUM,RGB_STRETCH,RGB_ASINH,MAKE_FITS,MAKE_RGB_STIFF,MAKE_RGB_LUPTON
  #     46.275669,-34.256000,,0.90,1.30,g,gry;riy,,,,,true,false,true
  #     ,,61407409,1.1,0.8,z,,riy,0.9,40.0,11.0,true,,true
  #
  # This example shows the minimum columns you must include when specifying 
  # positions only by coordinates:
  #
  #     RA,DEC
  #     46.275669,-34.256000
  # 
  # or only by Coadd ID
  #
  #     COADD_OBJECT_ID
  #     61407409
  #     61407435
  # 
  positions:
  # Survey data source database
  db: desdr
  # Survey data release
  release: dr1
  # Cutout dimensions
  xsize: 1.0 
  ysize: 1.0
  # User database credentials
  username:
  password:
  # Path to the directory containing the data tiles
  tiledir: auto
  #
  # FITS cutout image generation
  #
  # Enable (true) or disable (false) FITS file generation
  make_fits: true
  # Color bands to output (string value containing characters from the set 'grizy')
  colors_fits: 'i'
  # Discard FITS files that are only created in order to produce explicitly requested 
  # RGB images. FITS files that are explicitly requested are retained.
  discard_fits_files: false
  #
  # RGB image generation using STIFF format
  #
  # Enable (true) or disable (false) RGB file generation in STIFF format
  make_rgb_stiff: false
  # Sets of color band triplets, delineated by semi-colons, denoting by letter ordering
  # the bands to use for Red, Green, Blue in the generated RGB images.
  # Example: 'gri;rig;zgi' will produce three RGB images, where the image color-to-band
  # mapping is:
  #     1) Red: g, Green: r, Blue: i
  #     2) Red: r, Green: i, Blue: g
  #     3) Red: z, Green: g, Blue: i
  rgb_stiff_colors: 'gri'
  #
  # RGB image generation using Lupton method
  #
  # Enable (true) or disable (false) RGB file generation using Lupton format
  make_rgb_lupton: false
  # Sets of color band triplets, delineated by semi-colons, denoting by letter ordering
  # the bands to use for Red, Green, Blue in the generated RGB images. For an example see 
  # "rgb_stiff_colors" above.
  rgb_lupton_colors: 'gri'
  # The black point for the 3-color image
  rgb_minimum: 1.0
  # The linear stretch of the image
  rgb_stretch: 50.0
  # The asinh softening parameter
  rgb_asinh: 10.0
