// stores userstate
export function load({ locals }) {
    return {
        session: locals.session
    }
}