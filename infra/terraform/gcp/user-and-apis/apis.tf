# Enables APIs for the project
resource "google_project_service" "apis" {
  depends_on = [
    google_project_iam_member.container_admin,
    google_project_iam_member.network_admin,
    google_project_iam_member.artifactregistry_admin,
    google_project_iam_member.storage_admin,
    google_project_iam_member.logging_logWriter,
    google_project_iam_member.monitoring_metricWriter,
    google_project_iam_member.secretmanager_admin,
    google_project_iam_member.cloudbuild_serviceAccountUser,
    google_project_iam_member.serviceusage_serviceUsageAdmin,
    google_project_iam_member.serviceusage_ServiceAccountUser,
    google_project_iam_member.serviceusage_CloudBuild
  ]
  for_each = toset(var.apis)
  
  project            = var.project_id
  service            = each.value
  disable_on_destroy = false
}