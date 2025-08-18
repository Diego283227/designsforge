interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="min-h-screen flex flex-col">
        {/* Header space if needed */}
        <div className="flex-1 flex items-center justify-center p-4">
          {children}
        </div>
        {/* Footer space if needed */}
      </div>
    </div>
  );
};

export default Layout;
