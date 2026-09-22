import { ApplicationItem, StoredAlert, UserProfile, UserAuth, UserLocation } from '../types';

const STORAGE_KEYS = {
  LOCATION: 'skillora_location',
  SAVED_COMPANIES: 'skillora_saved_companies',
  APPLICATIONS: 'skillora_applications',
  ALERTS: 'skillora_alerts',
  PROFILE: 'skillora_profile',
  AUTH: 'skillora_auth'
};

const DEFAULT_LOCATION: UserLocation = {
  latitude: 12.9716,
  longitude: 77.5946,
  city: 'Bengaluru',
  address: 'Bengaluru Tech Corridor, Karnataka, India',
  isUserSpecified: false
};

export const StorageService = {
  // Location
  getLocation(): UserLocation {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOCATION);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return DEFAULT_LOCATION;
  },

  saveLocation(location: UserLocation) {
    try {
      localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(location));
    } catch {
      // ignore
    }
  },

  // Saved Companies
  getSavedCompanies(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_COMPANIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getSavedCompanyIds(): string[] {
    return this.getSavedCompanies();
  },

  saveSavedCompanies(ids: string[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_COMPANIES, JSON.stringify(ids));
    } catch {
      // ignore
    }
  },

  toggleSaveCompany(companyId: string): string[] {
    const ids = this.getSavedCompanies();
    const index = ids.indexOf(companyId);
    let updated: string[];
    if (index >= 0) {
      updated = ids.filter((id) => id !== companyId);
    } else {
      updated = [...ids, companyId];
    }
    this.saveSavedCompanies(updated);
    return updated;
  },

  // Applications Tracker
  getApplications(): ApplicationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    // Initial sample tracking items so user sees the pipeline in action immediately
    const initial: ApplicationItem[] = [
      {
        id: 'app-1',
        companyName: 'Microsoft',
        roleTitle: 'Software Engineer Intern — Cloud & AI',
        type: 'Internship',
        stage: 'Applied',
        updatedAt: '2026-09-18',
        notes: 'Submitted via careers portal with custom resume emphasizing distributed systems project.'
      },
      {
        id: 'app-2',
        companyName: 'Google',
        roleTitle: 'Associate Software Engineer (Fresher)',
        type: 'Fresher',
        stage: 'Assessment',
        updatedAt: '2026-09-20',
        notes: 'Online coding assessment invitation received. Focus on graph algorithms and system design basics.'
      },
      {
        id: 'app-3',
        companyName: 'Bosch Global Software Technologies',
        roleTitle: 'Embedded Software Engineer — Automotive Tech',
        type: 'Experienced',
        stage: 'Saved',
        updatedAt: '2026-09-16',
        notes: 'Reviewing AUTOSAR and CAN Bus requirements before submitting portfolio.'
      }
    ];
    this.saveApplications(initial);
    return initial;
  },

  saveApplications(items: ApplicationItem[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(items));
    } catch {
      // ignore
    }
  },

  addApplication(item: Omit<ApplicationItem, 'id' | 'updatedAt'>): ApplicationItem[] {
    const list = this.getApplications();
    const newItem: ApplicationItem = {
      ...item,
      id: `app-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newItem, ...list];
    this.saveApplications(updated);
    return updated;
  },

  updateApplicationStage(id: string, stage: ApplicationItem['stage']): ApplicationItem[] {
    const list = this.getApplications();
    const updated = list.map((item) =>
      item.id === id
        ? { ...item, stage, updatedAt: new Date().toISOString().split('T')[0] }
        : item
    );
    this.saveApplications(updated);
    return updated;
  },

  deleteApplication(id: string): ApplicationItem[] {
    const list = this.getApplications();
    const updated = list.filter((item) => item.id !== id);
    this.saveApplications(updated);
    return updated;
  },

  // Stored Alerts
  getAlerts(): StoredAlert[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALERTS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    const initial: StoredAlert[] = [
      {
        id: 'alert-1',
        title: 'Cloud & AI Internships in Bengaluru',
        query: 'Internship Cloud AI',
        radiusKm: 25,
        roleType: 'Internship',
        createdAt: '2026-09-15',
        active: true
      },
      {
        id: 'alert-2',
        title: 'Autonomous Mobility & Automotive Tech',
        query: 'Automotive Embedded',
        radiusKm: 50,
        roleType: 'Full-time',
        createdAt: '2026-09-18',
        active: true
      }
    ];
    this.saveAlerts(initial);
    return initial;
  },

  saveAlerts(items: StoredAlert[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(items));
    } catch {
      // ignore
    }
  },

  addAlert(alert: Omit<StoredAlert, 'id' | 'createdAt' | 'active'>): StoredAlert[] {
    const list = this.getAlerts();
    const newItem: StoredAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      active: true
    };
    const updated = [newItem, ...list];
    this.saveAlerts(updated);
    return updated;
  },

  toggleAlert(id: string): StoredAlert[] {
    const list = this.getAlerts();
    const updated = list.map((item) =>
      item.id === id ? { ...item, active: !item.active } : item
    );
    this.saveAlerts(updated);
    return updated;
  },

  deleteAlert(id: string): StoredAlert[] {
    const list = this.getAlerts();
    const updated = list.filter((item) => item.id !== id);
    this.saveAlerts(updated);
    return updated;
  },

  // User Profile
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return {
      name: 'Kaushik Poojari',
      email: 'kaushikpoojari0007@gmail.com',
      education: 'B.Tech / B.E. in Computer Science & Engineering (2026)',
      skills: ['Python', 'TypeScript', 'React', 'Data Structures & Algorithms', 'SQL', 'Git', 'Docker'],
      projects: 'Distributed Key-Value Store with Raft consensus; Real-time Geospatial Transit Tracker',
      certifications: 'AWS Certified Cloud Practitioner, Google Cloud Associate Cloud Engineer',
      github: 'https://github.com',
      targetRole: 'Software Engineer (Cloud / Distributed Systems)',
      targetCompany: 'Microsoft'
    };
  },

  saveProfile(profile: UserProfile) {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {
      // ignore
    }
  },

  // Auth state
  getAuth(): UserAuth {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return {
      isLoggedIn: true,
      email: 'kaushikpoojari0007@gmail.com',
      displayName: 'Kaushik Poojari',
      userId: 'usr-kaushik-0007'
    };
  },

  saveAuth(auth: UserAuth) {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
    } catch {
      // ignore
    }
  }
};
