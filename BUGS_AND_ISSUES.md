# Bugs / issues

So there are a few known bugs and a few unknown bugs in CodeClusters as of 18.8.2020. Also there are missing functionalities for placeholder buttons and such.

* URL query params might get lost when page is refreshed, especially with custom_filters. Something wrong with parsing them.
* Facets are not parsed from query params, should open the facets and set the params
* Also empty facets are pushed into query params for no reason
* Token facets don't work due to fact you can't wildcard query facets. So either you have to have individual facets for each keyword eg MUL_keywords or some other fix

* Search case sensitivity, regex, whole words don't work
* Search can be terribly slow due to the poor implementation of CodeBlock & CodeBlock. There is a virtualization component that has some problems with rendering correct heights which is why it's not used. Otherwise it would be super fast

* Selecting code lines for review doesn't set and save the selection correctly. Something to do with whitespaces or something

* Pagination's page is not set correctly when new results are fetched where there are fewer results than current page
* Also when switching to local search the page should be updated to eg first page (and pages counted correctly using the Results per page -value)

* All the modeling n-gram forms combinations have not been tested, there is probably bugs there with results that have eg no clusters

* the modeling server can't re-establish connection to the Postgres if it restarts
* also I assume there are in general lots of bugs in the modeling server

* Review flows are missing edit functionality and its form
* Also facets should be included in the new review flow modal
* Test flow button doesn't work (should basically just run the flow and see if it throws an error)
* Also review flow and review both have tags in new review flow params. Should probably just have one
* Also tags should be probably database entity to allow easy selection and preventing typos

* /reviews page has a lot of bugs, missing things and god ugly styles

* the UI might get awkward if you have bigger screen than my Mac's 1440x828 and different screen than Retina

* add checkbox for disabling auto search since it can get quite annoying developing locally as search can get slow due to the piss poor CodeBlock component

# Nice to have future features

* Go through real use-cases teachers might want to do and implement them
* Should have percentage counter to show how many submissions have already been processed
* Also should have controls to compare submissions between clusters better eg split view with two SearchResult lists
* LMS integration
* Add code syntax highlighting with eg prism.js
* More metrics eg ABC metric or Halstead stuff
* More models eg neural networks or tree-edit distance
* More data structures eg control flow graphs or word embeddings for code
* Some enhancements to vanilla TF-IDF
* Other similarity measures than cosine similarity
* Performance testing with bigger datasets eg 10,000 or 100,000 submissions
* Tests. lol