# Bugs / issues

So there are a few known bugs and a few unknown bugs in CodeClusters as of 21.8.2020. Also there are missing functionalities for placeholder buttons and such. The user interface was inspired by https://grep.app/ which explains some of the UI choices.

* URL query params might get lost when page is refreshed, especially with custom_filters. Something wrong with parsing them.
* Facets are not parsed from query params, should open the facets and set the params
* Well also results_start is not parsed correctly from query params
* Also empty facets are pushed into query params for no reason
* Token facets don't work due to fact you can't wildcard query facets. So either you have to have individual facets for each keyword eg MUL_keywords or some other fix

* Search case sensitivity, regex, whole words don't work

* When switching to local search when the current selectedPage is higher than available local pages, doesn't default the page to 1 (although shows results correctly)

* All the modeling n-gram forms combinations have not been tested, there is probably bugs there with results that have eg no clusters
* Also if you hover over the histogram bars, it will trigger million re-renders for some reason. The bug is in the used recharts library but hopefully somebody fixes it in the future

* I assume there are lots of bugs in the modeling server, should have tests and proper error messages for various error states instead of general 500

* Review flows are missing edit functionality and its form
* Also facets should be included in the new review flow modal
* Test flow button doesn't work (should basically just run the flow and see if it throws an error)
* Also review flow and review both have tags in new review flow params. Should probably just have one
* Also tags should be probably database entity to allow easy selection and preventing typos

* loading spinners might get stuck if some rapid mounting & clicking is done, probably should cancel the request when unmounted or have timeout to reset the loading values

* /reviews has probably bugs, missing things and styling issues

* the UI might get awkward if you have bigger screen than my Mac's 1440x828 and different screen than Retina

* no tests that check if database transactions fail they'll rollback correctly
 
* add checkbox for disabling auto search since it can get quite annoying developing locally as search can get slow due to the piss poor CodeBlock component

# Nice to have future features

* Go through real use-cases teachers might want to do and implement them
* Should have percentage counter to show how many submissions have already been processed
* Also should have controls to compare submissions between clusters better eg split view with two SearchResult lists
* LMS integration
* Add code syntax highlighting with eg prism.js
* Finish the use of virtualized list for SearchResultsList to boost performance (each time list is updated, all CodeBlock elements are recreated which can take from a second to a lot of seconds)
* More metrics eg ABC metric or Halstead stuff
* More models eg neural networks or tree-edit distance
* More data structures eg control flow graphs or word embeddings for code
* Some enhancements to vanilla TF-IDF
* Other similarity measures than cosine similarity
* Performance testing with bigger datasets eg 10,000 or 100,000 submissions
* Tests. lol

#102732 nav

#3cbbf8 bright blue

#d8f1ff mellow blue

#e1f1ff