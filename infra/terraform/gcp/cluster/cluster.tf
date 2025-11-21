resource "google_container_cluster" "default" {
  for_each = toset(var.cluster_name)

  name = "${lower(var.project_name)}-${each.value}-standard-cluster"

  location                 = var.region
  remove_default_node_pool = true
  initial_node_count       = 1
  enable_l4_ilb_subsetting = true

  network    = google_compute_network.default[each.key].id
  subnetwork = google_compute_subnetwork.default[each.key].id

  ip_allocation_policy {
    stack_type                    = var.cluster_stack_type
    services_secondary_range_name = google_compute_subnetwork.default[each.key].secondary_ip_range[0].range_name
    cluster_secondary_range_name  = google_compute_subnetwork.default[each.key].secondary_ip_range[1].range_name
  }

  # Set `deletion_protection` to `true` will ensure that one cannot
  # accidentally delete this instance by use of Terraform.
  deletion_protection = var.delete_protection
}

resource "google_container_node_pool" "default_pool" {
  for_each = toset(var.cluster_name)

  name     = "${lower(var.project_name)}-${each.value}-pool"
  location = var.region
  cluster  = google_container_cluster.default[each.key].name

  initial_node_count = 1

  autoscaling {
    min_node_count = 1
    max_node_count = 2
  }

  management {
    auto_upgrade = true
    auto_repair  = true
  }

  node_config {
    machine_type = "e2-small"
    disk_size_gb = 30
    disk_type    = "pd-balanced"

    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
    ]
    labels = {
      purpose = "general"
    }
    tags = ["gke-node"]
  }
}