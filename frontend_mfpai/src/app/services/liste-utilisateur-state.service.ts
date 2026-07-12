import { Injectable } from "@angular/core";

/**
 * État d'une liste d'utilisateurs (critères de recherche + pagination),
 * conservé lors des navigations internes (liste -> détail -> liste...).
 */
export interface ListeUtilisateurState {
  /** Valeurs du formulaire de recherche avancée. */
  formValue: any;
  /** Indique si une recherche était active (résultats affichés). */
  isSearchUser: boolean;
  page: number;
  pageSize: number;
}

/**
 * Conserve en mémoire l'état des recherches des listes d'utilisateurs
 * (niveau central et déconcentré) le temps de la session Angular :
 * l'état survit aux navigations internes (ex. liste -> détail -> retour)
 * mais est perdu au rechargement complet de la page (F5), ce qui est le
 * comportement attendu.
 */
@Injectable({ providedIn: "root" })
export class ListeUtilisateurStateService {
  private readonly states = new Map<string, ListeUtilisateurState>();

  save(key: string, state: ListeUtilisateurState): void {
    this.states.set(key, state);
  }

  get(key: string): ListeUtilisateurState | undefined {
    return this.states.get(key);
  }

  clear(key: string): void {
    this.states.delete(key);
  }
}
