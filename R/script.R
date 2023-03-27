#'
#' link.R
#' Created by Arnaud Künzi on 2023.03.27
#' @keywords internal
index_script <- function(src = NULL) {
  if (length(href) != 0) {
    script <- paste0('<script src="',src,'"><script/>')
  } else {
    script <- '<script src="darkstudio/inverse.js"><script/>'
  }
  return(script)
}
