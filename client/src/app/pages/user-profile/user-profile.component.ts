import { Component, type OnInit } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { UserStoreService } from "../../services/user-store.service"
import { UserService, AnnotatedImage, Ticket, Tab } from "../../services/user.service"



@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  profile: any = {}
  successAlert = ""
  isLoading = true

  editableImages: AnnotatedImage[] = []
  archivedImages: AnnotatedImage[] = []
  tickets: Ticket[] = []

  activeTab = "editable"

  tabs: Tab[] = []

  constructor(
    private http: HttpClient,
    private userStore: UserStoreService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    if (history.state?.successAlert) {
      this.successAlert = history.state.successAlert;
      setTimeout(() => this.successAlert = "", 2000);
    }

    this.userStore.user$.subscribe((user) => {
      if (user) {
        this.profile = {
          lastName: user.nom,
          firstName: user.prenom,
          email: user.email,
          photoUrl: user.avatar || "/placeholder.svg?height=300&width=300",
        };

        this.isLoading = true;

        this.userService.getImageDetails(user.id).subscribe({
          next: (data) => {
            this.editableImages = data.editableImages || [];
            this.archivedImages = data.archivedImages || [];
            this.tickets = data.tickets || [];
            this.isLoading = false;
          },
          error: (err) => {
            console.error("Error loading detailed images", err);
            this.isLoading = false;
          },
        });

        this.tabs = this.userService.tabs;
      }
    });
  }

  getItemCount(tabId: string): number {
    switch (tabId) {
      case "editable":
        return this.editableImages.length
      case "annotated":
        return this.archivedImages.length
      case "tickets":
        return this.tickets.length
      default:
        return 0
    }
  }
}

