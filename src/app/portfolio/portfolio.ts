import { Component, HostListener, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core'; // 1. Added AfterViewInit
import { isPlatformBrowser } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';
import { 
  faHouse, 
  faUser, 
  faGraduationCap, 
  faBriefcase, 
  faFolder,
  faGear ,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [FontAwesomeModule, NgIf],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio implements OnInit, AfterViewInit { // 2. Implemented AfterViewInit hook interface
  // Vector Icons
  homeIcon = faHouse;
  aboutIcon = faUser;
  educationIcon = faGraduationCap;
  careerIcon = faBriefcase;
  projectsIcon = faFolder;
  settingIcon = faGear;

  // Track the string ID of the currently visible screen section
  activeSection: string = 'home';

  // Component property state tracker
  public isModalOpen: boolean = false;

  // Contact variables to hold state details securely
  public emailId: string = 'your.email@example.com';
  public phoneNumber: string = '+91 12345 67890';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (!localStorage.getItem('portfolio_email')) {
        localStorage.setItem('portfolio_email', this.emailId);
      }
      if (!localStorage.getItem('portfolio_phone')) {
        localStorage.setItem('portfolio_phone', this.phoneNumber);
      }

      this.emailId = localStorage.getItem('portfolio_email') || this.emailId;
      this.phoneNumber = localStorage.getItem('portfolio_phone') || this.phoneNumber;
    }
  }

  // 3. This triggers instantly on page refresh after the view initializes
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Add a slight 100ms macro-task delay to let the browser restore the original scroll coordinates cleanly
      setTimeout(() => {
        this.checkActiveSection();
      }, 100);
    }
  }

  // Smooth Scroll Trigger
  scrollToElement(element: HTMLElement): void {
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start', 
        inline: 'nearest' 
      });
    }
  }

  // Monitor page scrolling positions across all devices
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkActiveSection();
  }

  // 4. Extracted logic into a shared helper method to avoid duplicate code
  private checkActiveSection(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const home = document.getElementById('home');
    const about = document.getElementById('about');
    const education = document.getElementById('education');
    const career = document.getElementById('career');
    const projects = document.getElementById('projects');

    const scrollPosition = window.scrollY || document.documentElement.scrollTop || 0;
    const offset = 150; 

    if (projects && scrollPosition >= (projects.offsetTop - offset)) {
      this.activeSection = 'projects';
    } else if (career && scrollPosition >= (career.offsetTop - offset)) {
      this.activeSection = 'career';
    } else if (education && scrollPosition >= (education.offsetTop - offset)) {
      this.activeSection = 'education';
    } else if (about && scrollPosition >= (about.offsetTop - offset)) {
      this.activeSection = 'about';
    } else {
      this.activeSection = 'home';
    }
  }
}
