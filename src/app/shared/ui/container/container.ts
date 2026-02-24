import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ui-container',
  templateUrl: './container.html',
  styleUrl: './container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Container {
  public readonly maxWidthPx = input<number | undefined>(undefined);

  /**
   * padding horizontal em px (opcional)
   * - se undefined, usa CSS var --app-padding-x
   */
  public readonly paddingX = input<number | undefined>(undefined);

  // Helper signals para bind direto no template (evita lógica no HTML)
  public readonly maxWidthStyle = computed(() => this.maxWidthPx() ?? null);
  public readonly paddingStyle = computed(() => this.paddingX() ?? null);
}
