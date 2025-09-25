import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 font-sans text-gray-800 antialiased">
      <div class="max-w-4xl mx-auto space-y-8 p-6 bg-white rounded-3xl shadow-2xl">
        
        <header class="text-center space-y-2 mb-8">
          <h1 class="text-4xl sm:text-5xl font-extrabold text-indigo-700 leading-tight">Volunteer Connect</h1>
          <p class="text-lg text-gray-500">Find opportunities, make an impact, track your hours.</p>
        </header>

        <!-- Navigation Buttons -->
        <div class="flex flex-wrap justify-center sm:justify-start gap-4 mb-8">
          <button
            (click)="currentPage.set('catalog')"
            [class.bg-indigo-600]="currentPage() === 'catalog'"
            [class.text-white]="currentPage() === 'catalog'"
            [class.bg-white]="currentPage() !== 'catalog'"
            [class.text-indigo-600]="currentPage() !== 'catalog'"
            class="py-2 px-6 rounded-full font-semibold transition duration-200 shadow-md border border-indigo-200 hover:bg-indigo-50"
          >
            All Opportunities
          </button>
          <button
            (click)="currentPage.set('myOpportunities')"
            [class.bg-indigo-600]="currentPage() === 'myOpportunities'"
            [class.text-white]="currentPage() === 'myOpportunities'"
            [class.bg-white]="currentPage() !== 'myOpportunities'"
            [class.text-indigo-600]="currentPage() !== 'myOpportunities'"
            class="py-2 px-6 rounded-full font-semibold transition duration-200 shadow-md border border-indigo-200 hover:bg-indigo-50"
          >
            My Opportunities
          </button>
          <button
            (click)="currentPage.set('postOpportunity')"
            [class.bg-indigo-600]="currentPage() === 'postOpportunity'"
            [class.text-white]="currentPage() === 'postOpportunity'"
            [class.bg-white]="currentPage() !== 'postOpportunity'"
            [class.text-indigo-600]="currentPage() !== 'postOpportunity'"
            class="py-2 px-6 rounded-full font-semibold transition duration-200 shadow-md border border-indigo-200 hover:bg-indigo-50"
          >
            Post an Opportunity
          </button>
        </div>

        <!-- Main Content Area -->
        @switch (currentPage()) {
          @case ('catalog') {
            <h2 class="text-2xl font-bold text-gray-700">Service Catalog</h2>
            <input
              type="text"
              placeholder="Search opportunities..."
              (input)="searchTerm.set($any($event.target).value)"
              class="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out placeholder-gray-400"
            />
            <div class="space-y-4">
              @if (filteredOpportunities().length === 0) {
                <div class="text-center text-gray-500 p-8 rounded-lg border-2 border-dashed border-gray-300">
                  <p>No opportunities found. Try a different search term!</p>
                </div>
              } @else {
                @for (opportunity of filteredOpportunities(); track opportunity.id) {
                  <div class="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between transition-transform transform hover:scale-[1.01] duration-200">
                    <div class="flex-grow space-y-1">
                      <h3 class="text-xl font-bold text-indigo-600">{{ opportunity.title }}</h3>
                      <p class="text-gray-600">{{ opportunity.description }}</p>
                      <div class="flex flex-wrap gap-2 mt-2">
                        @for (skill of opportunity.skills; track $index) {
                          <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">{{ skill }}</span>
                        }
                      </div>
                    </div>
                    <div class="mt-4 md:mt-0 md:ml-6 flex-shrink-0 flex space-x-2">
                      <button
                        (click)="viewDetails(opportunity)"
                        class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-6 rounded-xl shadow-sm transition duration-200 transform hover:scale-105"
                      >
                        Details
                      </button>
                      @if (signedUpOpportunities().has(opportunity.id)) {
                        <button
                          (click)="openLogHoursModal(opportunity.id)"
                          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition duration-200 transform hover:scale-105"
                        >
                          Log Hours
                        </button>
                      } @else {
                        <button
                          (click)="signUpForOpportunity(opportunity.id)"
                          class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition duration-200 transform hover:scale-105"
                        >
                          Sign Up
                        </button>
                      }
                    </div>
                  </div>
                }
              }
            </div>
          }
          @case ('myOpportunities') {
            <h2 class="text-2xl font-bold text-gray-700">My Opportunities</h2>
            <div class="space-y-4">
              @if (myOpportunities().length === 0) {
                <div class="text-center text-gray-500 p-8 rounded-lg border-2 border-dashed border-gray-300">
                  <p>You haven't signed up for any opportunities yet.</p>
                </div>
              } @else {
                @for (opportunity of myOpportunities(); track opportunity.id) {
                  <div class="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div class="flex-grow space-y-1">
                      <h3 class="text-xl font-bold text-indigo-600">{{ opportunity.title }}</h3>
                      <p class="text-gray-600">{{ opportunity.description }}</p>
                      @if (loggedHoursByOpportunity()[opportunity.id]) {
                        <p class="mt-2 text-sm font-semibold text-gray-500">
                          Logged Hours: <span class="text-indigo-600 font-bold">{{ loggedHoursByOpportunity()[opportunity.id] }}</span>
                        </p>
                      }
                    </div>
                    <div class="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                      <button
                        (click)="openLogHoursModal(opportunity.id)"
                        class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition duration-200 transform hover:scale-105"
                      >
                        Log Hours
                      </button>
                    </div>
                  </div>
                }
              }
            </div>
          }
          @case ('opportunityDetail') {
            @if (selectedOpportunity()) {
              <div class="space-y-6">
                <button (click)="backToCatalog()" class="flex items-center text-indigo-600 font-semibold hover:underline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="m15 18-6-6 6-6"/></svg>
                  Back to Catalog
                </button>
                <div class="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-4">
                  <h2 class="text-3xl font-extrabold text-indigo-700">{{ selectedOpportunity()!.title }}</h2>
                  <p class="text-gray-600 text-lg">{{ selectedOpportunity()!.description }}</p>
                  <div class="pt-2">
                    <h3 class="text-xl font-bold text-gray-700">Required Skills</h3>
                    <div class="flex flex-wrap gap-2 mt-2">
                      @for (skill of selectedOpportunity()!.skills; track $index) {
                        <span class="text-sm font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700">{{ skill }}</span>
                      }
                    </div>
                  </div>
                  <div class="mt-6">
                    @if (signedUpOpportunities().has(selectedOpportunity()!.id)) {
                      <button
                        (click)="openLogHoursModal(selectedOpportunity()!.id)"
                        class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-200 transform hover:scale-105"
                      >
                        Log Hours
                      </button>
                    } @else {
                      <button
                        (click)="signUpForOpportunity(selectedOpportunity()!.id)"
                        class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-200 transform hover:scale-105"
                      >
                        Sign Up
                      </button>
                    }
                  </div>
                </div>
              </div>
            }
          }
          @case ('postOpportunity') {
            <div class="space-y-6">
              <h2 class="text-2xl font-bold text-gray-700">Post a New Opportunity</h2>
              <form (submit)="postOpportunity($event)" class="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-6">
                <div>
                  <label for="title" class="block text-gray-700 font-semibold mb-2">Opportunity Title</label>
                  <input
                    type="text"
                    id="title"
                    [value]="newOpportunity.title"
                    (input)="newOpportunity.title = $any($event.target).value"
                    required
                    class="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out"
                  />
                </div>
                <div>
                  <label for="description" class="block text-gray-700 font-semibold mb-2">Description</label>
                  <textarea
                    id="description"
                    [value]="newOpportunity.description"
                    (input)="newOpportunity.description = $any($event.target).value"
                    rows="4"
                    required
                    class="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out"
                  ></textarea>
                </div>
                <div>
                  <label for="skills" class="block text-gray-700 font-semibold mb-2">Skills (comma-separated)</label>
                  <input
                    type="text"
                    id="skills"
                    [value]="newOpportunity.skills"
                    (input)="newOpportunity.skills = $any($event.target).value"
                    placeholder="e.g., Teamwork, Communication, Coding"
                    class="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out"
                  />
                </div>
                <button
                  type="submit"
                  class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-200 transform hover:scale-105"
                >
                  Post Opportunity
                </button>
              </form>
            </div>
          }
        }

        <!-- Service Hours Breakdown -->
        @if (totalHours() > 0) {
          <div class="bg-gray-100 p-6 rounded-2xl shadow-inner space-y-4 mt-8">
            <h2 class="text-2xl font-bold text-gray-700">My Hours Breakdown</h2>
            <div class="space-y-2">
              @for (item of loggedHoursBreakdown(); track item.id) {
                <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow-md">
                  <span class="font-semibold text-gray-700">{{ item.title }}</span>
                  <span class="font-bold text-indigo-600">{{ item.hours }} hours</span>
                </div>
              }
            </div>
          </div>
        }

        <!-- Log Hours Modal -->
        @if (showLogHoursModal()) {
          <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full space-y-6">
              <h3 class="text-2xl font-bold text-gray-700">Log Hours</h3>
              <p class="text-gray-600">Enter the number of hours you volunteered for:</p>
              
              <input
                type="number"
                [value]="hoursToLog()"
                (input)="hoursToLog.set($any($event.target).valueAsNumber)"
                class="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out"
                min="0"
              />

              <div class="flex justify-end space-x-3">
                <button
                  (click)="closeLogHoursModal()"
                  class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-xl transition duration-200"
                >
                  Cancel
                </button>
                <button
                  (click)="submitLoggedHours()"
                  [disabled]="hoursToLog() <= 0"
                  class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class App {
  // Signals to manage the user's state
  totalHours = signal(0);
  loggedHoursByOpportunity = signal<Record<number, number>>({});
  searchTerm = signal('');
  signedUpOpportunities = signal(new Set<number>());
  hoursToLog = signal(0);
  hoursModalOpportunityId = signal<number | null>(null);
  showLogHoursModal = signal(false);

  // Signals for page routing
  currentPage = signal<'catalog' | 'myOpportunities' | 'opportunityDetail' | 'postOpportunity'>('catalog');
  selectedOpportunity = signal<any | null>(null);

  // Signal for the new opportunity form
  newOpportunity = {
    title: '',
    description: '',
    skills: ''
  };

  // Mock Service Catalog data using signals
  // In a real app, this data would come from a database API call
  opportunities = signal([
    { id: 1, title: 'Community Garden Cleanup', description: 'Help maintain our local community garden by weeding, planting, and mulching. This is a great opportunity to get your hands dirty and connect with nature, all while making a tangible difference in your community.', skills: ['Gardening', 'Teamwork', 'Patience'] },
    { id: 2, title: 'Senior Citizen Companionship', description: 'Spend time with local seniors, playing games, or just having a friendly chat. This role is perfect for empathetic individuals who want to brighten someone\'s day and listen to incredible stories.', skills: ['Communication', 'Empathy'] },
    { id: 3, title: 'Animal Shelter Support', description: 'Assist with daily tasks at the animal shelter, including walking dogs, cleaning kennels, and socializing with the animals. Your help provides a safe and loving environment for animals waiting for their forever homes.', skills: ['Animal Care', 'Responsibility'] },
    { id: 4, title: 'Beach Clean-up Drive', description: 'Help keep our beaches clean by picking up litter and educating the public about plastic pollution. This is a crucial step in protecting our marine life and preserving our beautiful coastlines for future generations.', skills: ['Environmentalism', 'Physical Work'] },
    { id: 5, title: 'Coding for a Cause', description: 'Use your programming skills to help a non-profit build a new website or application. This is a high-impact, remote opportunity where your technical expertise can empower an organization to achieve its mission more effectively.', skills: ['Programming', 'Web Development', 'Problem Solving'] },
  ]);

  constructor() {
    this.loadStateFromLocalStorage();
    // This effect runs whenever loggedHoursByOpportunity or signedUpOpportunities changes.
    effect(() => {
      this.saveStateToLocalStorage();
    }, { allowSignalWrites: true });
  }

  // Save state to local storage
  saveStateToLocalStorage() {
    const state = {
      loggedHours: this.loggedHoursByOpportunity(),
      signedUp: Array.from(this.signedUpOpportunities())
    };
    localStorage.setItem('volunteerState', JSON.stringify(state));
  }

  // Load state from local storage
  loadStateFromLocalStorage() {
    const savedState = localStorage.getItem('volunteerState');
    if (savedState) {
      const state = JSON.parse(savedState);
      this.loggedHoursByOpportunity.set(state.loggedHours);
      this.signedUpOpportunities.set(new Set(state.signedUp));
      this.totalHours.set(Object.values(state.loggedHours).reduce((sum: number, hours: any) => sum + hours, 0));
    }
  }

  // Computed signal for live filtering of opportunities
  filteredOpportunities = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.opportunities().filter(op =>
      op.title.toLowerCase().includes(term) ||
      op.description.toLowerCase().includes(term) ||
      op.skills.some(skill => skill.toLowerCase().includes(term))
    );
  });
  
  // Computed signal to get only the opportunities the user has signed up for
  myOpportunities = computed(() => {
    const signedUpIds = this.signedUpOpportunities();
    return this.opportunities().filter(op => signedUpIds.has(op.id));
  });

  // Computed signal to create a formatted breakdown of logged hours for the UI
  loggedHoursBreakdown = computed(() => {
    const hoursMap = this.loggedHoursByOpportunity();
    const opportunities = this.opportunities();
    return Object.entries(hoursMap)
      .filter(([id, hours]) => hours > 0)
      .map(([id, hours]) => {
        const opportunity = opportunities.find(op => op.id === +id);
        return {
          id: +id,
          title: opportunity?.title || 'Unknown Opportunity',
          hours: hours
        };
      });
  });

  /**
   * Adds the opportunity to the list of signed-up opportunities.
   * @param opportunityId The ID of the opportunity.
   */
  signUpForOpportunity(opportunityId: number) {
    this.signedUpOpportunities.update(currentSet => {
      const newSet = new Set(currentSet);
      newSet.add(opportunityId);
      return newSet;
    });
    // Automatically switch to My Opportunities view after signing up
    this.currentPage.set('myOpportunities');
  }

  /**
   * Posts a new opportunity to the service catalog.
   * @param event The form submission event.
   */
  postOpportunity(event: Event) {
    event.preventDefault();
    const newId = Date.now();
    const newOp = {
      id: newId,
      title: this.newOpportunity.title,
      description: this.newOpportunity.description,
      skills: this.newOpportunity.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
    };
    this.opportunities.update(currentOps => [...currentOps, newOp]);
    this.newOpportunity = { title: '', description: '', skills: '' }; // Reset form
    this.currentPage.set('catalog');
  }

  /**
   * Navigates to the opportunity details page.
   * @param opportunity The opportunity object to display.
   */
  viewDetails(opportunity: any) {
    this.selectedOpportunity.set(opportunity);
    this.currentPage.set('opportunityDetail');
  }

  /**
   * Navigates back to the main catalog page.
   */
  backToCatalog() {
    this.currentPage.set('catalog');
    this.selectedOpportunity.set(null); // Clear selected opportunity
  }

  /**
   * Opens the modal to log hours for a specific opportunity.
   * @param opportunityId The ID of the opportunity.
   */
  openLogHoursModal(opportunityId: number) {
    this.hoursModalOpportunityId.set(opportunityId);
    this.hoursToLog.set(0); // Reset the input value
    this.showLogHoursModal.set(true);
  }

  /**
   * Closes the hours logging modal.
   */
  closeLogHoursModal() {
    this.showLogHoursModal.set(false);
    this.hoursModalOpportunityId.set(null);
  }

  /**
   * Submits the logged hours from the modal.
   */
  submitLoggedHours() {
    const opportunityId = this.hoursModalOpportunityId();
    const hoursToLog = this.hoursToLog();

    if (opportunityId !== null && hoursToLog > 0) {
      // Update the total hours
      this.totalHours.update(currentHours => currentHours + hoursToLog);

      // Update hours for the specific opportunity.
      this.loggedHoursByOpportunity.update(currentMap => {
        const newMap = { ...currentMap };
        newMap[opportunityId] = (newMap[opportunityId] || 0) + hoursToLog;
        return newMap;
      });

      console.log(`Logged ${hoursToLog} hours for opportunity ID ${opportunityId}. Total hours: ${this.totalHours()}`);
      this.closeLogHoursModal();
    }
  }
}
