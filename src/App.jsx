import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Moon, Sun, Upload, Search, AlertTriangle } from 'lucide-react';

function App() {
  const [theme, setTheme] = useState('light');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [anomalies, setAnomalies] = useState([]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  const onDrop = useCallback((acceptedFiles) => {
    setError(null);
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file));
    } else {
      setError('Please upload a valid image file.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false
  });

  const analyzeImage = async () => {
    if (!image) {
      setError('Please upload an image first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnomalies([
        { id: 1, x: 50, y: 60, width: 80, height: 80 },
        { id: 2, x: 150, y: 100, width: 60, height: 60 }
      ]);
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center sm:text-left">
            Product Anomaly Detection
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 dark:text-gray-200" />
            ) : (
              <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 dark:text-gray-200" />
            )}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
              ${image ? 'border-green-500' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500 mb-2 sm:mb-4" />
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              {isDragActive
                ? 'Drop the image here'
                : 'Drag and drop your image here or click to select'}
            </p>
          </div>

          {image && (
            <div className="mt-4 sm:mt-6 relative">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative"
              >
                <img
                  src={image}
                  alt="Uploaded product"
                  className="w-full rounded-lg"
                />
                {anomalies.map((anomaly) => (
                  <motion.div
                    key={anomaly.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute border-2 border-red-500 bg-red-500/20"
                    style={{
                      left: `${anomaly.x}px`,
                      top: `${anomaly.y}px`,
                      width: `${anomaly.width}px`,
                      height: `${anomaly.height}px`
                    }}
                  />
                ))}
              </motion.div>
            </div>
          )}

          <div className="mt-4 sm:mt-6 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={analyzeImage}
              disabled={!image || loading}
              className={`
                flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white text-sm sm:text-base
                ${loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'}
                transition-colors
              `}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Analyze Image
                </>
              )}
            </motion.button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-200 rounded-lg flex items-center text-sm sm:text-base"
              >
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {anomalies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 sm:mt-6"
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                Detected Anomalies
              </h2>
              <div className="space-y-2">
                {anomalies.map((anomaly) => (
                  <div
                    key={anomaly.id}
                    className="p-2 sm:p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm sm:text-base"
                  >
                    <p className="text-gray-700 dark:text-gray-200">
                      Anomaly #{anomaly.id}: ({anomaly.x}, {anomaly.y})
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <footer className="mt-6 sm:mt-8 text-center text-sm sm:text-base text-gray-500 dark:text-gray-400">
          © 2025 Product Anomaly Detection. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default App;