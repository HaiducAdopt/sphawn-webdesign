export default function Footer() {
  return (
    <footer className="bg-transparent backdrop-transparent py-4">
      <div className="max-w-6xl mx-auto px-4">

        {/* Text aliniat dreapta */}
        <p className="text-[12px] sm:text-[14px] md:text-[16px] font-medium text-right text-white mb-2">
          © 2025 Bety — Web Design & Development
        </p>

        {/* Bara gradient */}
        <div
          className="w-full h-[8px] rounded-[4px]"
          style={{
            background: "linear-gradient(90deg, #099CB6 0%, #BC4EF0 100%)",
          }}
        ></div>
      </div>
    </footer>
  );
}
