import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { LoadingScreen } from './components/LoadingScreen';
import { Login } from './components/Login';
import { Chat } from './components/Chat';

function App() {
  const { currentUser, isLoading, setLoadingProgress } = useStore();

  useEffect(() => {
    // Simulate loading
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          useStore.setState({ isLoading: false });
        }, 500);
      }
      setLoadingProgress(progress);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return currentUser ? <Chat /> : <Login />;
}

export default App;