#############################
# Google Project Variables
#############################
variable "project_id" {
  description = "The id of the project"
  type = string
  default = ""
}

variable "region" {
  description = "The region of the project"
  type = string
  default = ""
}

#############################
# Project Variables
#############################
variable "project_name" {
  description = "The name of the project"
  type = string
  default = ""
}

#############################
# Network Variables
#############################
variable "ipv6_access_type" {
  description = "The access type of the ipv6"
  type = string
  default = "EXTERNAL" # Change to "INTERNAL" if creating an internal loadbalancer
}

variable "cluster_stack_type" {
  description = "Cluster IP stack type: IPV4 or IPV4_IPV6"
  type        = string
  default     = "IPV4"
}

variable "subnetwork_stack_type" {
  description = "Subnetwork IP stack type: IPV4_ONLY, IPV4_IPV6 or IPV6_ONLY"
  type        = string
  default     = "IPV4_ONLY"
}

#############################
# Cluster Variables
#############################
variable "delete_protection" {
  description = "The delete protection of the cluster"
  type = bool
  default = false
}

variable "cluster_name" {
  description = "The name of the cluster"
  type = list(string)
  default = ["production"]
}