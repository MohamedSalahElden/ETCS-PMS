from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from flask import json
from .models import MarkdownContent
from .forms import ImageUploadForm , FileUploadForm, MarkdownContentForm
import markdown
from .forms import MarkdownContentForm, ImageUploadForm
from projects.models import Project
from django.contrib.auth.decorators import login_required


@login_required
def writeup_list(request, project_id):
    return render(request, 'writeups/writeup_list.html', )




def create_content(request, project_id):
    project = get_object_or_404(Project, id=project_id)

    if request.method == 'POST':
        # 🔹 Check if it's an AJAX request (JSON-based)
        if request.headers.get('Content-Type') == 'application/json':
            try:
                data = json.loads(request.body)  # ✅ Correct way to read JSON data
            except json.JSONDecodeError:
                return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)

            content = data.get("content", "").strip()
            title = data.get("title", "").strip()

            # 🔹 Validate empty content
            if not content:
                return JsonResponse({"success": False, "error": "Content cannot be empty"}, status=400)

            # 🔹 Save the markdown content
            markdown_content = MarkdownContent.objects.create(
                title=title,
                content=content,
                project=project,
                creator=request.user,
            )

            return JsonResponse({"success": True, "id": markdown_content.id})

        # 🔹 If not JSON, handle standard form submission
        form = MarkdownContentForm(request.POST)
        if form.is_valid():
            markdown_content = form.save(commit=False)
            markdown_content.project = project
            markdown_content.creator = request.user
            markdown_content.save()
            return JsonResponse({"success": True, "id": markdown_content.id})

        return JsonResponse({"success": False, "error": "Invalid form data"}, status=400)

    # 🔹 If GET request, render the form
    form = MarkdownContentForm()
    initial_text = '''\n# Embedded Cybersecurity: Protecting the Core of IoT Systems\n[task: Firmware Analysis •](@user-chip:/users/firmware-analysis)\n## Introduction\nEmbedded systems are the backbone of many modern technologies, ranging from **IoT devices** to **critical infrastructure**. These systems are often deployed in sensitive environments where security breaches can lead to significant consequences. In this document, we'll explore the importance of embedded cybersecurity and the measures that can be taken to protect these systems.\n> **"Embedded systems are everywhere – from medical devices to industrial machines. Securing these devices is crucial to ensuring the safety of the modern world."** – Cybersecurity Expert\n## Why Embedded Cybersecurity is Important\n### The Role of Embedded Systems in Cybersecurity\nEmbedded systems are **purpose-built** systems designed to perform specific tasks. They control everything from household appliances to high-performance military equipment. As these devices become interconnected through networks, they become increasingly vulnerable to cyberattacks.\n#### Key Security Risks in Embedded Systems:\n| Risk Type          | Description                                                            | Example                            |\n|--------------------|------------------------------------------------------------------------|------------------------------------|\n| **Physical Attacks**| Malicious actors gaining physical access to the system.                | Fault Injection Attacks            |\n| **Side-channel Attacks**| Exploiting the physical characteristics of a device during operation. | Power Analysis Attacks             |\n| **Software Vulnerabilities**| Exploits in the firmware or OS running on the device.           | Buffer Overflow in Firmware        |\n| **Network-based Attacks**| Targeting the device through communication interfaces.          | Man-in-the-Middle (MITM) Attacks   |\n### Common Threats to Embedded Systems\n1. **Firmware Exploits**: Many embedded devices run custom firmware. Attackers may target these vulnerabilities to compromise the device.\n2. **Supply Chain Attacks**: Malicious components or firmware could be introduced during manufacturing.\n3. **Unauthorized Access**: Weak authentication and encryption mechanisms leave devices open to unauthorized control.\n### Security Measures for Embedded Systems\n#### 1. **Secure Boot Process**\nThe **Secure Boot** process ensures that only trusted firmware is loaded during the device startup. This prevents attackers from replacing the device's firmware with malicious versions.\n```c\n// C code example for implementing a basic secure boot\nif (verify_firmware_signature(firmware)) {\n    load_firmware(firmware);\n} else {\n    // Stop booting if the firmware is tampered\n    halt_device();\n}\n```\n![default_wallpaper.png](/media/project_files/default_wallpaper_egogbC8.png)\n'''

    return render(request, 'editor/editor.html', {'form': form, 'project': project, 'initial_text': initial_text})

def view_content(request, pk):
    content = get_object_or_404(MarkdownContent, pk=pk)
    html_content = markdown.markdown(content.content, extensions=['extra'])
    return render(request, 'editor/view_content.html',  {'content': html_content})


def upload_image(request , project_id):
    project = get_object_or_404(Project, id=project_id)
    print("image uploaded")
    if request.method == 'POST':
        form = ImageUploadForm(request.POST, request.FILES)
        if form.is_valid():
            image = form.save(commit=False)  # Don't save yet
            image.project = project  # Assign the project to the image
            image.save()
            return JsonResponse({'location': image.file.url})
        return JsonResponse({'error': 'Invalid image'}, status=400)
    return JsonResponse({'error': 'Invalid method'}, status=405)


def upload_file(request):
    print("file uploaded")
    if request.method == 'POST':
        form = FileUploadForm(request.POST, request.FILES)
        if form.is_valid():
            file = form.save()
            return JsonResponse({'location': file.file.url})
        else:
            print(form.errors)  # Log errors to help debug
            return JsonResponse({'error': 'Invalid file'}, status=400)
    return JsonResponse({'error': 'Invalid method'}, status=405)



# views.py
from django.http import JsonResponse

def autocomplete_items(request , project_id):
    # Optionally, you can filter items based on a query parameter:
    # query = request.GET.get('query', '')
    # For now we return a fixed list.
    tasks = [
    {'name': 'task: Firmware Analysis', 'slug': '/users/firmware-analysis'},
    {'name': 'task: JTAG Debugging', 'slug': 'jtag-debugging'},
    {'name': 'task: Wireless Protocol Assessment', 'slug': 'wireless-protocol-assessment'},
    {'name': 'task: Secure Boot Verification', 'slug': 'secure-boot-verification'},
    {'name': 'task: Hardware Interface Testing', 'slug': 'hardware-interface-testing'},
    {'name': 'task: Bootloader Vulnerability Assessment', 'slug': 'bootloader-vulnerability-assessment'},
    {'name': 'task: Memory Dump Analysis', 'slug': 'memory-dump-analysis'},
    {'name': 'task: Peripheral Security Evaluation', 'slug': 'peripheral-security-evaluation'},
    {'name': 'task: Debug Port Scanning', 'slug': 'debug-port-scanning'},
    {'name': 'task: I2C Bus Analysis', 'slug': 'i2c-bus-analysis'},
    {'name': 'task: SPI Bus Security Testing', 'slug': 'spi-bus-security-testing'},
    {'name': 'task: CAN Bus Security Assessment', 'slug': 'can-bus-security-assessment'},
    {'name': 'task: UART Communication Analysis', 'slug': 'uart-communication-analysis'},
    {'name': 'task: Bluetooth Low Energy Assessment', 'slug': 'bluetooth-low-energy-assessment'},
    {'name': 'task: Wi-Fi Module Security', 'slug': 'wifi-module-security'},
    {'name': 'task: Radio Frequency Interference Testing', 'slug': 'rf-interference-testing'},
    {'name': 'task: Cryptographic Implementation Review', 'slug': 'cryptographic-implementation-review'},
    {'name': 'task: Hardware Reverse Engineering', 'slug': 'hardware-reverse-engineering'},
    {'name': 'task: Chipset Vulnerability Scan', 'slug': 'chipset-vulnerability-scan'},
    {'name': 'task: Embedded Linux Security Audit', 'slug': 'embedded-linux-security-audit'},
    {'name': 'task: Real-time OS Security Evaluation', 'slug': 'rtos-security-evaluation'},
    {'name': 'task: Supply Chain Risk Assessment', 'slug': 'supply-chain-risk-assessment'},
    {'name': 'task: Physical Tampering Analysis', 'slug': 'physical-tampering-analysis'},
    {'name': 'task: PCB Layout Security Review', 'slug': 'pcb-layout-security-review'},
    {'name': 'task: Debugging Port Lockdown Testing', 'slug': 'debugging-port-lockdown-testing'},
    {'name': 'task: Embedded Web Interface Assessment', 'slug': 'embedded-web-interface-assessment'},
    {'name': 'task: Sensor Data Integrity Testing', 'slug': 'sensor-data-integrity-testing'},
    {'name': 'task: Power Analysis Attacks', 'slug': 'power-analysis-attacks'},
    {'name': 'task: Side-Channel Analysis', 'slug': 'side-channel-analysis'},
    {'name': 'task: EMF Emission Testing', 'slug': 'emf-emission-testing'},
    {'name': 'task: Software Update Mechanism Testing', 'slug': 'software-update-mechanism-testing'},
    {'name': 'task: Network Interface Security Testing', 'slug': 'network-interface-security-testing'},
    {'name': 'task: Serial Communication Security Assessment', 'slug': 'serial-communication-security-assessment'},
    {'name': 'task: Boot Process Analysis', 'slug': 'boot-process-analysis'},
    {'name': 'task: Memory Corruption Vulnerability Scan', 'slug': 'memory-corruption-vulnerability-scan'},
    {'name': 'task: Penetration Simulation', 'slug': 'penetration-simulation'},
    {'name': 'task: Hardware Intrusion Detection Testing', 'slug': 'hardware-intrusion-detection-testing'},
    {'name': 'task: Secure Element Assessment', 'slug': 'secure-element-assessment'},
    {'name': 'task: Power Supply Analysis', 'slug': 'power-supply-analysis'},
    {'name': 'File: RF Protocol Security Testing', 'slug': 'rf-protocol-security-testing'},
    {'name': 'File: OTA Update Security', 'slug': 'ota-update-security'},
    {'name': 'File: Hardware Abstraction Layer Audit', 'slug': 'hardware-abstraction-layer-audit'},
    {'name': 'File: Debug Interface Lockout Testing', 'slug': 'debug-interface-lockout-testing'},
    {'name': 'File: Device Access Control Review', 'slug': 'device-access-control-review'},
    {'name': 'File: Inter-Integrated Circuit Security Testing', 'slug': 'inter-integrated-circuit-security-testing'},
    {'name': 'File: Industrial Control System Assessment', 'slug': 'industrial-control-system-assessment'},
    {'name': 'File: Firmware Integrity Verification', 'slug': 'firmware-integrity-verification'},
    {'name': 'File: Physical Layer Attack Simulation', 'slug': 'physical-layer-attack-simulation'},
    {'name': 'File: Device Hardening Evaluation', 'slug': 'device-hardening-evaluation'},
    {'name': 'File: Bootloader Exploit Testing', 'slug': 'bootloader-exploit-testing'}
]

    return JsonResponse(tasks, safe=False)