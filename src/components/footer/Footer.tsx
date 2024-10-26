import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="py-6 mt-8 z-50">
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center">
          <div className="text-center">
            <p className="text-sm text-white">
              &copy; {new Date().getFullYear()} Tariq Amarneh. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer