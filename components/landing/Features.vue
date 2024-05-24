<script setup>
const features = [
  {
    title: "Multiple Reporting Channels",
    description:
      "Dial *519*71# from your phone, use the android App or report here!",
    icon: "bx:bx-bell-plus",
  },
  {
    title: "Secure and Confidential",
    description:
      "Your Grievance is recorded and managed securely. Only you and Grievance redress committee knows it! Feel free to report anonymously",
    icon: "bx:bx-shield",
  },
  {
    title: "Monitor your Grievances",
    description:
      "Dial *519*71# from your phone to monitor resolution progress or use the Check status link here ",
    icon: "bx:bx-chart",
  },
  {
    title: "Escalate as needed",
    description:
      "Not satisfied by the GRC decision? Escalate via  *519*71#.",
    icon: "bx:bx-arrow-to-top",
  },
  {
    title: "Upload your documentation",
    description:
      "DO you have sensitive documentation to share with us? Its securely managed and kept by us",
    icon: "bx:bx-file",
  },
  {
    title: "Support",
    description:
      "Your grievances, compliments and complaints enable this project to be implemented successfully. Reach out",
    icon: "bx:bxs-user",
  },
];
</script>

<template>
  <div class="mt-16 md:mt-0">
    <h2 class="text-4xl lg:text-5xl font-bold lg:tracking-tight">
      Your complaints and compliments matter to us
    </h2>
    <p class="text-lg mt-4 text-slate-600">
      We provide multiple channels through which you can report and monitor the resolution of your grievances within the stipulated project safeguards
    </p>
  </div>

  <div class="grid sm:grid-cols-2 md:grid-cols-3 mt-16 gap-16">
    <div v-for="item of features" class="flex gap-4 items-start">
      <div class="mt-1 bg-black rounded-full p-2 w-8 h-8 shrink-0">
        <Icon class="text-white" :name="item.icon" />
      </div>
      <div>
        <h3 class="font-semibold text-lg">{{ item.title }}</h3>
        <p class="text-slate-500 mt-2 leading-relaxed">
          {{ item.description }}
        </p>
      </div>
    </div>
  </div>
</template>
