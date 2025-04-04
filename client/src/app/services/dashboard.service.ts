import { Injectable } from "@angular/core"
import type { HttpClient } from "@angular/common/http"
import { type Observable, of } from "rxjs"
import type { StatCard, ChartData, TableData, AnnotationProject } from "../classes/dashboard"

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  // Dans une application réelle, cette URL pointerait vers votre API
  private apiUrl = "https://api.example.com/annotation"

  constructor() {}

  getStatCards(): Observable<StatCard[]> {
    // Dans une application réelle, vous feriez un appel API comme:
    // return this.http.get<StatCard[]>(`${this.apiUrl}/stats`);

    const mockData: StatCard[] = [
      {
        title: "Utilisateurs",
        value: "156",
        change: 8.2,
        icon: "users",
        color: "#4f46e5",
      },
      {
        title: "Images Annotées",
        value: "12,845",
        change: 12.5,
        icon: "image",
        color: "#10b981",
      },
      {
        title: "Projets",
        value: "38",
        change: 4.3,
        icon: "folder",
        color: "#f59e0b",
      },
      {
        title: "Taux de Complétion",
        value: "78%",
        change: 2.4,
        icon: "check-circle",
        color: "#ef4444",
      },
    ]

    return of(mockData)
  }

  getAnnotationProgressChart(): Observable<ChartData> {
    const mockData: ChartData = {
      labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
      datasets: [
        {
          label: "Images Annotées",
          data: [1250, 1580, 1890, 2340, 2780, 3005],
          backgroundColor: "rgba(79, 70, 229, 0.2)",
          borderColor: "#4f46e5",
          fill: true,
        },
        {
          label: "Images Importées",
          data: [1500, 1800, 2100, 2600, 3000, 3200],
          backgroundColor: "rgba(239, 68, 68, 0.2)",
          borderColor: "#ef4444",
          fill: true,
        },
      ],
      type: "line",
    }

    return of(mockData)
  }

  getUserProductivityChart(): Observable<ChartData> {
    const mockData: ChartData = {
      labels: ["Jean", "Marie", "Thomas", "Sophie", "Lucas"],
      datasets: [
        {
          label: "Images Annotées par Utilisateur",
          data: [320, 280, 250, 220, 180],
          backgroundColor: "#10b981",
        },
      ],
      type: "bar",
    }

    return of(mockData)
  }

  getRecentProjects(): Observable<TableData> {
    const mockData: TableData = {
      headers: ["ID Projet", "Nom du Projet", "Statut", "Images", "Progression", "Date Limite"],
      rows: [
        {
          id: "PRJ-001",
          name: "Détection de véhicules",
          status: "active",
          images: "2450/3000",
          progress: "82%",
          deadline: "2023-07-15",
        },
        {
          id: "PRJ-002",
          name: "Segmentation urbaine",
          status: "active",
          images: "1200/2000",
          progress: "60%",
          deadline: "2023-07-30",
        },
        {
          id: "PRJ-003",
          name: "Classification piétons",
          status: "completed",
          images: "1500/1500",
          progress: "100%",
          deadline: "2023-06-20",
        },
        {
          id: "PRJ-004",
          name: "Détection de panneaux",
          status: "pending",
          images: "0/1800",
          progress: "0%",
          deadline: "2023-08-10",
        },
        {
          id: "PRJ-005",
          name: "Segmentation route",
          status: "active",
          images: "850/1200",
          progress: "71%",
          deadline: "2023-07-25",
        },
      ],
    }

    return of(mockData)
  }

  // Méthode pour obtenir les projets détaillés (pour une utilisation future)
  getProjects(): Observable<AnnotationProject[]> {
    const mockProjects: AnnotationProject[] = [
      {
        id: "PRJ-001",
        name: "Détection de véhicules",
        status: "active",
        imagesCount: 3000,
        annotatedCount: 2450,
        createdAt: "2023-05-10",
        deadline: "2023-07-15",
      },
      {
        id: "PRJ-002",
        name: "Segmentation urbaine",
        status: "active",
        imagesCount: 2000,
        annotatedCount: 1200,
        createdAt: "2023-05-15",
        deadline: "2023-07-30",
      },
      {
        id: "PRJ-003",
        name: "Classification piétons",
        status: "completed",
        imagesCount: 1500,
        annotatedCount: 1500,
        createdAt: "2023-04-20",
        deadline: "2023-06-20",
      },
      {
        id: "PRJ-004",
        name: "Détection de panneaux",
        status: "pending",
        imagesCount: 1800,
        annotatedCount: 0,
        createdAt: "2023-06-05",
        deadline: "2023-08-10",
      },
      {
        id: "PRJ-005",
        name: "Segmentation route",
        status: "active",
        imagesCount: 1200,
        annotatedCount: 850,
        createdAt: "2023-05-25",
        deadline: "2023-07-25",
      },
    ]

    return of(mockProjects)
  }
}

