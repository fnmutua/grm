<template>
  <main class="grid lg:grid-cols-2 place-items-center pt-16 pb-8 md:pt-8">
    <div class="p-24 md:order-1 hidden md:block">
      <img
        class="rounded-full transition-transform transform hover:scale-125"
        src="~/assets/img/grm1.png"
        alt="Starship starts the engine"
        loading="eager"
        format="avif"
        width="512"
        height="512"
      />
    </div>

    <div>
      <h1 class="text-5xl lg:text-6xl xl:text-7xl font-bold lg:tracking-tight">
        Grievance Reporting System
      </h1>
      <p class="text-lg mt-4 text-slate-600 max-w-xl">
        Do you have any grievances with the implementation of DRiVE project activities? Use this platform to let us know.
      </p>
      <div class="mt-6 flex flex-col sm:flex-row gap-3">
        <LandingLink
          to="/report"
           >File a Grievance</LandingLink
        >
         <LandingLink
          size="lg"
          styleName="outline"
          to="/grievances"

          >Check Status</LandingLink
        >
      </div>
    </div>
  </main>
</template>
