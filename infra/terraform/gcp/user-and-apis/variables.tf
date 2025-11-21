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

variable "project_name" {
  description = "The name of the project"
  type = string
  default = ""
}

#############################
# Enable APIs
#############################
variable "apis" {
  description = "The APIs to enable"
  type = list(string)
  default = [
    "container.googleapis.com",
    "compute.googleapis.com",
    "iam.googleapis.com",
    "artifactregistry.googleapis.com",
    "serviceusage.googleapis.com",
    "secretmanager.googleapis.com",
    "storage.googleapis.com"
    ]
}

#############################
# Initial Service Account
#############################
variable "email" {
  description = "Email of the initial service account that runs bootstrap (needs Editor role)"
  type = string
  default = ""
}