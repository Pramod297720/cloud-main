import { useOutletContext } from 'react-router-dom';

export default function Dashboard() {
    const { user } = useOutletContext();
    return (
        <section style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
            <h2>Welcome, {user.name.split(' ')[0]}!</h2>
            <p>You’re signed in as a {user.role}.</p>
            <p>Start adding CBT exercises or join workshops from the nav.</p>
        </section>
    );
}
