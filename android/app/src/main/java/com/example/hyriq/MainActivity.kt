package com.example.hyriq

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import com.example.hyriq.theme.HyriqTheme

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    enableEdgeToEdge()
    setContent {
      HyriqTheme { 
        Surface(
          modifier = Modifier.fillMaxSize().statusBarsPadding(), 
          color = MaterialTheme.colorScheme.background
        ) { 
          HyriqWebView("http://10.0.2.2:5000") 
        } 
      }
    }
  }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun HyriqWebView(url: String) {
  AndroidView(
    factory = { context ->
      WebView(context).apply {
        webViewClient = WebViewClient()
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.loadWithOverviewMode = true
        settings.useWideViewPort = true
        loadUrl(url)
      }
    },
    update = { webView ->
      // Can be used to load new urls
    },
    modifier = Modifier.fillMaxSize()
  )
}
