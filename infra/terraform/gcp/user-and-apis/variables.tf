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
    "serviceusage.googleapis.com",
    "iam.googleapis.com",
    "container.googleapis.com",
    "compute.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "storage.googleapis.com",
    "cloudbuild.googleapis.com"
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