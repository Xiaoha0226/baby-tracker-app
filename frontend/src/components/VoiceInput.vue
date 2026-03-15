<template>
  <div class="voice-input">
    <button
      class="voice-btn"
      :class="{ recording: isRecording, processing: isProcessing }"
      @touchstart.prevent="startRecording"
      @touchend.prevent="stopRecording"
      @mousedown.prevent="startRecording"
      @mouseup.prevent="stopRecording"
      @mouseleave="stopRecording"
    >
      <div class="btn-content">
        <div v-if="isProcessing" class="processing-icon">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <span v-else-if="isRecording" class="recording-icon">🎤</span>
        <span v-else class="mic-icon">🎤</span>
        <span class="btn-text">
          {{ isProcessing ? '识别中...' : isRecording ? '松开结束' : '长按说话' }}
        </span>
      </div>
      <div v-if="isRecording" class="recording-wave">
        <span v-for="i in 5" :key="i" class="wave-bar"></span>
      </div>
    </button>
    
    <div v-if="error" class="error-toast">
      {{ error }}
    </div>
    
    <div v-if="transcript" class="transcript-preview">
      <div class="transcript-text">"{{ transcript }}"</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useRecordsStore } from '@/stores/records'

const emit = defineEmits<{
  record: [records: any[]]
}>()

const recordsStore = useRecordsStore()

const isRecording = ref(false)
const isProcessing = ref(false)
const error = ref('')
const transcript = ref('')

let recognition: any = null
let mediaStream: MediaStream | null = null

function initSpeechRecognition() {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  
  if (!SpeechRecognition) {
    error.value = '您的浏览器不支持语音识别'
    return null
  }
  
  const recog = new SpeechRecognition()
  recog.continuous = false
  recog.interimResults = false
  recog.lang = 'zh-CN'
  
  recog.onresult = async (event: any) => {
    const text = event.results[0][0].transcript
    transcript.value = text
    await processVoiceText(text)
  }
  
  recog.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error)
    if (event.error === 'not-allowed') {
      error.value = '请允许麦克风权限'
    } else {
      error.value = '语音识别失败，请重试'
    }
    isRecording.value = false
    isProcessing.value = false
  }
  
  recog.onend = () => {
    isRecording.value = false
  }
  
  return recog
}

async function startRecording() {
  if (isRecording.value || isProcessing.value) return
  
  error.value = ''
  transcript.value = ''
  
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    
    recognition = initSpeechRecognition()
    if (!recognition) return
    
    isRecording.value = true
    recognition.start()
  } catch (e: any) {
    console.error('Failed to get microphone:', e)
    error.value = '请允许麦克风权限'
  }
}

function stopRecording() {
  if (!isRecording.value) return
  
  if (recognition) {
    recognition.stop()
    recognition = null
  }
  
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
    mediaStream = null
  }
  
  isRecording.value = false
}

async function processVoiceText(text: string) {
  isProcessing.value = true
  
  try {
    const records = await recordsStore.analyzeVoiceText(text)
    
    if (records && records.length > 0) {
      emit('record', records)
      transcript.value = ''
    } else if (recordsStore.error) {
      error.value = recordsStore.error
    }
  } catch (e: any) {
    error.value = e.message || 'AI分析失败'
  } finally {
    isProcessing.value = false
  }
}

onUnmounted(() => {
  stopRecording()
})
</script>

<style scoped>
.voice-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, var(--bg-primary), transparent);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.voice-btn {
  width: 100%;
  max-width: 300px;
  height: 60px;
  border: none;
  border-radius: var(--border-radius-full);
  background: linear-gradient(135deg, var(--primary-pink) 0%, var(--primary-pink-dark) 100%);
  color: var(--white);
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-card);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.voice-btn.recording {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%);
  transform: scale(1.05);
}

.voice-btn.processing {
  background: linear-gradient(135deg, var(--soft-purple) 0%, #CE93D8 100%);
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.recording-icon {
  font-size: 24px;
  animation: pulse 1s infinite;
}

.mic-icon {
  font-size: 24px;
}

.processing-icon {
  display: flex;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  background: var(--white);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.recording-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
  padding-bottom: 8px;
}

.wave-bar {
  width: 4px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 2px;
  animation: wave 1s ease-in-out infinite;
}

.wave-bar:nth-child(1) { animation-delay: 0s; height: 8px; }
.wave-bar:nth-child(2) { animation-delay: 0.1s; height: 12px; }
.wave-bar:nth-child(3) { animation-delay: 0.2s; height: 16px; }
.wave-bar:nth-child(4) { animation-delay: 0.3s; height: 12px; }
.wave-bar:nth-child(5) { animation-delay: 0.4s; height: 8px; }

@keyframes wave {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(2); }
}

.error-toast {
  background: #FFEBEE;
  color: #C62828;
  padding: 10px 20px;
  border-radius: var(--border-radius-full);
  font-size: 14px;
  animation: slideUp 0.3s ease;
}

.transcript-preview {
  background: var(--white);
  padding: 12px 20px;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-soft);
  animation: slideUp 0.3s ease;
}

.transcript-text {
  font-size: 14px;
  color: var(--text-secondary);
  font-style: italic;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
