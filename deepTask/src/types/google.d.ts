interface Window {
    google: {
        accounts: {
            id: {
                initialize(config: {
                    client_id: string
                    callback: (response: { credential: string }) => void
                }): void
                prompt(momentListener?: (notification: {
                    isNotDisplayed(): boolean
                    isSkippedMoment(): boolean
                }) => void): void
                renderButton(container: HTMLElement, options: {
                    type?: 'standard' | 'icon'
                    theme?: 'outline' | 'filled_blue' | 'filled_black'
                    size?: 'large' | 'medium' | 'small'
                    text?: string
                    shape?: string
                    width?: number
                }): void
                cancel(): void
            }
        }
    }
}
