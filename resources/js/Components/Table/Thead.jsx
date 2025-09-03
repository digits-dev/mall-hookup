const Thead = ({children}) => {
  return (
     <thead className="sticky z-50 bg-white top-0 left-0  after:absolute after:bottom-0 after:left-0  after:h-[0.60px] after:w-full after:bg-secondary">
        {children}
     </thead>
  )
}
export default Thead
