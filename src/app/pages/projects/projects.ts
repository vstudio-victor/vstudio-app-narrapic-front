import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Project {
  title: string;
  type: string;
  date: string;
  seed: string;
}

@Component({
  selector: 'ltz-projects',
  imports: [RouterLink],
  templateUrl: './projects.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  filters = ['All', 'Postcards', 'Prints', 'Mockups'];
  activeFilter = signal('All');
  search = signal('');

  projects: Project[] = [
    { title: 'Luxembourg Postcard', type: 'Postcards', date: 'May 24, 2026', seed: 'luxembourg-1' },
    { title: 'Paris Vintage Print', type: 'Prints', date: 'May 13, 2026', seed: 'paris-2' },
    { title: 'Amalfi Coast Print', type: 'Prints', date: 'May 22, 2026', seed: 'amalfi-3' },
    { title: 'Tokyo Night Mockup', type: 'Mockups', date: 'May 10, 2026', seed: 'tokyo-4' },
    { title: 'Santorini Postcard', type: 'Postcards', date: 'Apr 28, 2026', seed: 'santorini-5' },
    { title: 'Lisbon Tile Mockup', type: 'Mockups', date: 'Apr 19, 2026', seed: 'lisbon-6' },
  ];

  filteredProjects = computed(() => {
    const filter = this.activeFilter();
    const query = this.search().trim().toLowerCase();
    return this.projects.filter((p) => {
      const matchesFilter = filter === 'All' || p.type === filter;
      const matchesQuery = !query || p.title.toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });
  });

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
  }

  onSearch(value: string): void {
    this.search.set(value);
  }
}
