import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {
    let url: URL

    func makeUIView(context: Context) -> WKWebView {
        let prefs = WKWebpagePreferences()
        prefs.allowsContentJavaScript = true
        
        let config = WKWebViewConfiguration()
        config.defaultWebpagePreferences = prefs
        
        let webView = WKWebView(frame: .zero, configuration: config)
        webView.allowsBackForwardNavigationGestures = true
        
        // Ensure correct layout scales
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {
        let request = URLRequest(url: url)
        uiView.load(request)
    }
}

struct ContentView: View {
    // Replace with your hosted Render URL for production (e.g. "https://hyriq.onrender.com")
    let targetURL = URL(string: "https://hyriq.onrender.com")!

    var body: some View {
        ZStack {
            Color(red: 0.10, green: 0.24, blue: 0.38) // var(--corporate-blue) background
                .ignoresSafeArea()
            
            WebView(url: targetURL)
                .ignoresSafeArea(edges: .bottom)
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
