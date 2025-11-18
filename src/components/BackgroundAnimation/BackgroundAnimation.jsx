export default function BackgroundAnimation({ isDark }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className={`absolute top-20 left-10 w-72 h-72 ${isDark ? 'bg-purple-500' : 'bg-indigo-400'} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse`}></div>
      <div className={`absolute top-40 right-10 w-72 h-72 ${isDark ? 'bg-pink-500' : 'bg-pink-400'} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse`} style={{ animationDelay: '2s' }}></div>
      <div className={`absolute -bottom-8 left-20 w-72 h-72 ${isDark ? 'bg-indigo-500' : 'bg-purple-400'} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse`} style={{ animationDelay: '4s' }}></div>
    </div>
  )
}
