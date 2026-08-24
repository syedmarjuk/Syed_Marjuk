PUT YOUR IMAGES IN THIS FOLDER
==============================

Files the site uses right now
-----------------------------

profile.jpg          Your portrait, shown in the About section.

og-image.jpg         1200 x 630 px. The preview card shown when you
                     share your link on WhatsApp, LinkedIn etc.

field-net-tow.jpg    Gallery: plankton net photos, nobody in frame.
field-net-wake.jpg
field-net-line.jpg
field-net-haul.jpg


ONLY YOUR OWN PHOTOS
--------------------

Photos of colleagues are NOT included. Publishing someone else's
face on a public website needs their permission.

To add photos of yourself, save them here and then add an entry to
the GALLERY list in assets/js/data.js. Suggested filenames:

  me-deck.jpg          you on deck / at sea
  me-sampling.jpg      you working with nets or instruments
  me-lab.jpg           you at the microscope or bench

If you have a group photo you want to use, get the other people's
agreement first, or crop it so only you are identifiable.


Adding figures to a model page
------------------------------

1. Save the figure here, e.g.  pbm-scatter.png
2. In your model page, reference it like this:

   <figure class="card">
     <img src="../assets/img/pbm-scatter.png"
          alt="Scatter plot of predicted versus measured phytoplankton
               biomass, R squared 0.87"
          width="1200" height="800" loading="lazy">
     <figcaption class="mono" style="color:var(--fg-faint);margin-top:var(--s-3)">
       Fig 1 - Predicted vs measured biomass across validation stations.
     </figcaption>
   </figure>

ALWAYS include:
  alt=""      describe what the figure SHOWS, not "graph" - screen
              reader users and Google both rely on this
  width/height   stops the page jumping around while the image loads
  loading="lazy" makes the page load faster


Keeping files small
-------------------

Large images make the site slow. Before uploading:

  - Aim for under 300 KB per image
  - 1600 px wide is plenty for a full-width figure
  - Use https://squoosh.app (free, runs in your browser) to shrink them
  - WebP is smaller than PNG at the same quality
