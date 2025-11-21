resource "google_compute_network" "default" {
  for_each = toset(var.cluster_name)

  name = "${lower(var.project_name)}-${each.value}-network"

  auto_create_subnetworks  = false
  enable_ula_internal_ipv6 = false
}

resource "google_compute_subnetwork" "default" {
  for_each = toset(var.cluster_name)

  name = "${lower(var.project_name)}-${each.value}-subnetwork"

  ip_cidr_range = "10.0.0.0/16"
  region        = var.region

  stack_type       = var.subnetwork_stack_type
  ipv6_access_type = var.subnetwork_stack_type != "IPV4_ONLY" ? var.ipv6_access_type : null

  network = google_compute_network.default[each.key].id
  secondary_ip_range {
    range_name    = "services-range"
    ip_cidr_range = "192.168.0.0/24"
  }

  secondary_ip_range {
    range_name    = "pod-ranges"
    ip_cidr_range = "192.168.1.0/24"
  }
}