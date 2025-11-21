# Roles for infra management
resource "google_project_iam_member" "container_admin" {
  depends_on = [google_project_service.apis]

  project = var.project_id
  role    = "roles/container.admin"
  member  = "serviceAccount:${var.email}"
}

resource "google_project_iam_member" "network_admin" {
  depends_on = [google_project_service.apis]

  project = var.project_id
  role    = "roles/compute.networkAdmin"
  member  = "serviceAccount:${var.email}"
}

resource "google_project_iam_member" "artifactregistry_admin" {
  depends_on = [google_project_service.apis]

  project = var.project_id
  role    = "roles/artifactregistry.admin"
  member  = "serviceAccount:${var.email}"
}

resource "google_project_iam_member" "storage_admin" {
  depends_on = [google_project_service.apis]

  project = var.project_id
  role    = "roles/storage.admin"
  member  = "serviceAccount:${var.email}"
}

resource "google_project_iam_member" "logging_logWriter" {
  depends_on = [google_project_service.apis]

  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${var.email}"
}

resource "google_project_iam_member" "monitoring_metricWriter" {
  depends_on = [google_project_service.apis]

  project = var.project_id
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${var.email}"
}

resource "google_project_iam_member" "secretmanager_admin" {
  depends_on = [google_project_service.apis]

  project = var.project_id
  role    = "roles/secretmanager.admin"
  member  = "serviceAccount:${var.email}"
}

resource "google_project_iam_member" "cloudbuild_serviceAccountUser" {
  depends_on = [google_project_service.apis]

  project = var.project_id
  role    = "roles/cloudbuild.builds.builder"
  member  = "serviceAccount:${var.email}"
}

resource "google_project_iam_member" "serviceusage_serviceUsageAdmin" {
  depends_on = [google_project_service.apis]

  project = var.project_id
  role    = "roles/serviceusage.serviceUsageAdmin"
  member  = "serviceAccount:${var.email}"
}