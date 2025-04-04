export interface StatCard {
  title: string
  value: number | string
  change: number
  icon: string
  color: string
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
    fill?: boolean
  }[]
  type: "bar" | "line" | "pie" | "doughnut"
}

export interface TableData {
  headers: string[]
  rows: any[]
}

export interface AnnotationProject {
  id: string
  name: string
  status: "active" | "completed" | "pending"
  imagesCount: number
  annotatedCount: number
  createdAt: string
  deadline?: string
}

export interface AnnotationImage {
  id: string
  projectId: string
  projectName: string
  fileName: string
  status: "annotated" | "in-progress" | "pending"
  annotatedBy?: string
  annotatedAt?: string
}

export interface AnnotationUser {
  id: string
  name: string
  role: "admin" | "annotator" | "reviewer"
  imagesAnnotated: number
  lastActive: string
}

