resource "google_cloudbuildv2_repository" "github" {
  project           = var.project_id
  location          = var.region
  name              = "${var.project_name}-repo"
  parent_connection = google_cloudbuildv2_connection.github-connection.id
  remote_uri        = "https://github.com/${var.github_repo}.git"
}