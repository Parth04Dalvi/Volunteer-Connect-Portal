import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 font-sans text-gray-800 antialiased">
      <div class="max-w-4xl mx-auto space-y-8 p-6 bg-white rounded-3xl shadow-2xl">
        
        <header class="text-center space-y-2">
          <h1 class="text-4xl sm:text-5xl font-extrabold text-indigo-700 leading-tight">Volunteer Connect</h1>
          <p class="text-lg text-gray-500">Find opportunities, make an impact, track your hours.</p>
        </header>

        <!-- Volunteer Dashboard Summary -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
          <div class="bg-indigo-50 border-l-4 border-indigo-400 rounded-lg p-5 shadow-inner">
            <h2 class="text-sm font-semibold text-indigo-600 uppercase tracking-wide">My Service Hours</h2>
            <p class="text-3xl font-bold text-indigo-800 mt-1">{{ totalHours() }}</p>
          </div>
          <div class="bg-purple-50 border-l-4 border-purple-400 rounded-lg p-5 shadow-inner">
            <h2 class="text-sm font-semibold text-purple-600 uppercase tracking-wide">Opportunities Signed Up</h2>
            <p class="text-3xl font-bold text-purple-800 mt-1">{{ signedUpOpportunities().size }}</p>
          </div>
        </div>

        <!-- Service Catalog Search & Filter -->
        <div class="bg-gray-100 p-6 rounded-2xl shadow-inner space-y-4">
          <h2 class="text-2xl font-bold text-gray-700">Service Catalog</h2>
          <input
            type="text"
            placeholder="Search opportunities..."
            (input)="searchTerm.set($any($event.target).value)"
            class="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out placeholder-gray-400"
          />
        </div>

        <!-- Opportunities List -->
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

        <!-- Service Hours Breakdown -->
        @if (totalHours() > 0) {
          <div class="bg-gray-100 p-6 rounded-2xl shadow-inner space-y-4">
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
  // Mock Service Catalog data using signals
  // In a real app, this data would come from a database API call
  opportunities = signal([
    { id: 1, title: 'Community Garden Cleanup', description: 'Help maintain our local community garden by weeding, planting, and mulching.', skills: ['Gardening', 'Teamwork', 'Patience'] },
    { id: 2, title: 'Senior Citizen Companionship', description: 'Spend time with local seniors, playing games, or just having a friendly chat.', skills: ['Communication', 'Empathy'] },
    { id: 3, title: 'Animal Shelter Support', description: 'Assist with daily tasks at the animal shelter, including walking dogs and cleaning kennels.', skills: ['Animal Care', 'Responsibility'] },
    { id: 4, title: 'Beach Clean-up Drive', description: 'Help keep our beaches clean by picking up litter and educating the public about plastic pollution.', skills: ['Environmentalism', 'Physical Work'] },
    { id: 5, title: 'Coding for a Cause', description: 'Use your programming skills to help a non-profit build a new website or application.', skills: ['Programming', 'Web Development', 'Problem Solving'] },
  ]);

  // Signals to manage the user's state
  totalHours = signal(0);
  loggedHoursByOpportunity = signal<Record<number, number>>({});
  searchTerm = signal('');
  signedUpOpportunities = signal(new Set<number>());
  hoursToLog = signal(0);
  hoursModalOpportunityId = signal<number | null>(null);
  showLogHoursModal = signal(false);

  // Computed signal for live filtering of opportunities
  filteredOpportunities = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.opportunities().filter(op =>
      op.title.toLowerCase().includes(term) ||
      op.description.toLowerCase().includes(term) ||
      op.skills.some(skill => skill.toLowerCase().includes(term))
    );
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
