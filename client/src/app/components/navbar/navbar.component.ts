import { Component } from '@angular/core';
import { HostListener, ElementRef } from '@angular/core';
import { UserStoreService } from '../../services/user-store.service';
import { trigger, transition, style, animate } from "@angular/animations";

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css'],
  animations: [
    trigger("dropdownAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(-10px)" }),
        animate("200ms ease-out", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
      transition(":leave", [animate("150ms ease-in", style({ opacity: 0, transform: "translateY(-10px)" }))]),
    ]),
    trigger("mobileMenuAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(-10px)" }),
        animate("200ms ease-out", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
      transition(":leave", [animate("150ms ease-in", style({ opacity: 0, transform: "translateY(-10px)" }))]),
    ]),
  ],
})

export class NavbarComponent {
	user$ = this.userStore.user$;
	toggleDropdown = false;
	isMenuOpen = false;
  isMobileMenuOpen = false

	constructor(
		private userStore: UserStoreService,
		private eRef: ElementRef
	) {}


	ngOnInit(): void {
		this.user$.subscribe(user => {
			console.log('User Store:', user);
		});
	}

	toggleMenu(): void {
		this.isMenuOpen = !this.isMenuOpen;
	}

	handleLogout(): void {
		localStorage.removeItem('auth_token');
		this.userStore.clear();
		location.reload();
	}

	@HostListener('document:click', ['$event'])
	onDocumentClick(event: Event): void {
		if (!this.eRef.nativeElement.contains(event.target)) {
			this.isMenuOpen = false;
		}
	}

	handleDropdownOption(): void {
		this.isMenuOpen = false;
	}

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen
    if (this.isMobileMenuOpen) {
      this.isMenuOpen = false
    }
  }

  closeAllMenus(): void {
    this.isMenuOpen = false
    this.isMobileMenuOpen = false
  }

}
