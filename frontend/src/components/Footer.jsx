import React from 'react'

function Footer() {
    return (
        <>
            <footer className="text-black text-center py-2 pt-40">
                <div className="container mx-auto">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} Stability Nexus. All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    )
}

export default Footer