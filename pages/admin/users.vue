<template>

<LandingSectionhead>
      <template v-slot:title>Users</template>
      <template v-slot:desc>Manage user rights.</template>
    </LandingSectionhead>


  <div >
  

    <!-- Right Column -->
    <div class=" pt-16 pb-8 md:pt-8 pl-4 pr-5">
      <UCard
        class="w-full"
        :ui="{
          base: '',
          ring: '',
          divide: 'divide-y divide-gray-200 dark:divide-gray-700',
          header: { padding: 'px-4 py-5' },
          body: {
            padding: '',
            base: 'divide-y divide-gray-200 dark:divide-gray-700',
          },
          footer: { padding: 'p-4' },
        }"
      >
        <div
          class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700 items-center space-x-2"
        >
          <UInput v-model="q" placeholder="Filter..." />
          <UButton
            v-if="total > 0"
            icon="i-heroicons-cloud-arrow-down"
            size="sm"
            color="primary"
            variant="link"
            label="Download"
            :trailing="false"
            @click="downloadXLSX"
          />
          <UButton
            v-if="total > 0"
            icon="i-heroicons-arrow-path"
            size="sm"
            color="primary"
            variant="link"
            label="Refresh"
            :trailing="false"
            @click="onChange(0)"
          />

          <UDropdown
            v-if="ShowMultipleActions"
            :items="actions"
            :popper="{ placement: 'bottom-start' }"
          >
            <UButton
              color="white"
              label="Actions"
              trailing-icon="i-heroicons-chevron-down-20-solid"
            />
          </UDropdown>
        </div>

        <div></div>
        <template #footer>
          <div class="flex flex-wrap justify-between items-center">
            <div class="flex items-center gap-1.5">
              <span v-if="total > 0" class="text-sm leading-5"
                >Rows per page:</span
              >
              <USelect
                v-model="pageCount"
                :options="[3, 5, 10, 20, 30, 40]"
                @change="onPageCountChange"
                @click="onPageChange"
                class="me-2 w-20"
                size="xs"
                v-if="total > 0"
              />
            </div>

            <div class="flex items-center gap-1.5">
              <span class="text-sm leading-5" v-if="total > 0">
                Showing
                <span class="font-medium">{{ pageFrom }}</span>
                to
                <span class="font-medium">{{ pageTo }}</span>
                of
                <span class="font-medium">{{ total }}</span>
                results
              </span>

              <UPagination
                v-if="total > 0"
                v-model="page"
                :page-count="pageCount"
                :total="total"
                @click="onPageChange"
                :prev-button="{
                  icon: 'i-heroicons-arrow-small-left-20-solid',
                  label: 'Prev',
                  color: 'gray',
                }"
                :next-button="{
                  icon: 'i-heroicons-arrow-small-right-20-solid',
                  trailing: true,
                  label: 'Next',
                  color: 'gray',
                }"
                :ui="{
                  wrapper: 'flex items-center gap-1',
                  rounded: '!rounded-full min-w-[32px] justify-center',
                  default: {
                    activeButton: {
                      variant: 'outline',
                    },
                  },
                }"
              />
            </div>
          </div>
        </template>

        <div style="width: 100%; margin-top: 50px">
          <UTable
            v-model="selected"
            :rows="filteredRows"
            :columns="columns"
            :loading="pending"
            class="w-full"
            :ui="{
              td: { base: 'max-w-[0] truncate' },
              default: { checkbox: { color: 'green' } },
            }"
          >
            <template #name-data="{ row }">
              <span
                :class="[
                  selected.find((row) => row.id === row.id) &&
                    'text-primary-500 dark:text-primary-400',
                ]"
                >{{ row.code }}</span
              >
            </template>
            <template #completed-data="{ row }">
              <UBadge
                size="xs"
                :label="
                  row.acceptance === 'Pending'
                    ? 'Pending'
                    : row.acceptance === 'Accepted'
                    ? 'Accepted'
                    : 'Rejected'
                "
                :color="
                  row.acceptance === 'Pending'
                    ? 'orange'
                    : row.acceptance === 'Accepted'
                    ? 'emerald'
                    : 'red'
                "
                variant="subtle"
              />
            </template>

            <template #actions-data="{ row }">
              <UDropdown :items="items(row)">
                <UButton
                  variant="ghost"
                  icon="i-heroicons-ellipsis-vertical "
                />
              </UDropdown>
            </template>
          </UTable>
        </div>

        <UModal v-model="showDetailsModal">
          <UCard
            :ui="{
              base: 'h-full flex flex-col',
              rounded: '',
              divide: 'divide-y divide-gray-100 dark:divide-gray-800',
              body: {
                base: 'grow',
              },
            }"
          >
            <template #header>
              <div class="flex items-center justify-between">
                <h3
                  class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                >
                  Rights Allocation
                </h3>
                <UButton
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-x-mark-20-solid"
                  class="-my-1"
                  @click="showDetailsModal = false"
                />
              </div>
            </template>
            <div>
              <p>
                You are allocating
                <span class="highlight">{{ user_details.jina }}</span> the
                selected roles below:
              </p>
              <UDivider label="***" />
            </div>
            <div class="checkbox-container" style="margin-top: 20px">
              <UCheckbox
                v-for="(role, index) in roles"
                :key="index"
                v-model="checkedRoles"
                :value="role.code"
              >
                <template #label>
                  <span>{{ role.description }}</span>
                </template>
              </UCheckbox>
            </div>

            <template #footer>
              <div class="flex justify-end items-center gap-2">
                <UButton
                  @click="showDetailsModal = false"
                  variant="outline"
                  color="gray"
                  >Cancel</UButton
                >
                <UButton @click="EditRights" variant="outline" color="green"
                  >Submit</UButton
                >
              </div>
            </template>
          </UCard>
        </UModal>
      </UCard>

      <UModal v-model="isOpenRights">
        <UCard
          :ui="{
            base: 'h-full flex flex-col',
            rounded: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
            body: {
              base: 'grow',
            },
          }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h3
                class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
              >
                Rights Allocation
              </h3>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-1"
                @click="isOpenRights = false"
              />
            </div>
          </template>
          <div>
            <p>
              You are allocating
              <span class="highlight">{{ selected_users }}</span> the selected
              roles below:
            </p>
            <UDivider label="***" />
          </div>
          <div class="checkbox-container" style="margin-top: 20px">
            <UCheckbox
              v-for="(role, index) in roles"
              :key="index"
              v-model="checkedRoles"
              :value="role.code"
            >
              <template #label>
                <span>{{ role.description }}</span>
              </template>
            </UCheckbox>
          </div>

          <template #footer>
            <div class="flex justify-end items-center gap-2">
              <UButton
                @click="isOpenRights = false"
                variant="outline"
                color="gray"
                >Cancel</UButton
              >
              <UButton @click="EditRights" variant="outline" color="green"
                >Submit</UButton
              >
            </div>
          </template>
        </UCard>
      </UModal>

      <UModal v-model="isEditUser">
        <UCard
          :ui="{
            base: 'h-full flex flex-col',
            rounded: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
            body: {
              base: 'grow',
            },
          }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h3
                class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
              >
                Edit User Details
              </h3>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-1"
                @click="isEditUser = false"
              />
            </div>
          </template>

          <UCard
            :ui="{
              body: {
                base: 'grid grid-cols-1 sm:grid-cols-1',
                justify: 'center',
              },
              style: { width: '10%' },
              shadow: 'shadow',
            }"
          >
            <!-- Form Section -->

            <UForm
              :validate="validate"
              :state="form"
              class="grid grid-cols-1 sm:grid-cols-2 gap-4"
              @submit="onSubmit"
            >
              <div class="sm:col-span-1 space-y-4">
                <UFormGroup label="Your Name " name="Name">
                  <UInput
                    v-model="user_details.name"
                    placeholder="John Mpenda Pesa"
                    variant="outline"
                  />
                </UFormGroup>

                <UFormGroup label="Telephone" name="Telephone" required>
                  <UInput
                    v-model="user_details.phone"
                    type="text"
                    placeholder="0700 000 000"
                    required
                  />
                </UFormGroup>

                <UFormGroup label="Gender" name="Gender" required>
                  <USelect
                    v-model="user_details.gender"
                    :options="Gender"
                    placeholder="Select"
                    required
                  />
                </UFormGroup>

                <UFormGroup label="Email/Username" name="email">
                  <UInput
                    id="formattedInput"
                    v-model="user_details.username"
                    class="mr-2"
                  />
                </UFormGroup>
               
              </div>

              <div class="sm:col-span-1 space-y-4">
                <UFormGroup label="County" name="County" required>
                  <USelect
                    v-model="user_details.county"
                    :options="counties"
                    placeholder="Select"
                    @change="getSubCounties"
                    required
                  >
                  </USelect>
                </UFormGroup>

                <UFormGroup label="Subcounty" name="Subcounty" required>
                  <USelect
                    v-model="user_details.subcounty"
                    :options="subcounties"
                    placeholder="Select"
                    @change="getWards"
                    required
                    :disabled="subcounty_disabled"
                  />
                </UFormGroup>

                <UFormGroup label="Ward" name="Ward" required>
                  <USelect
                    v-model="user_details.ward"
                    :options="wards"
                    placeholder="Select"
                    @change="getSettlements"
                    required
                    :disabled="ward_disabled"
                  />
                </UFormGroup>

                <UFormGroup label="Settlement" name="Settlement" required>
                  <USelect
                    v-model="user_details.settlement"
                    :options="settlements"
                    placeholder="Select"
                    required
                    :disabled="settlements_disabled"
                  />
                </UFormGroup>
 
              </div>
            </UForm>
          </UCard>
          <template #footer>
            <div class="flex justify-end items-center gap-2">
              <UButton
                @click="isEditUser = false"
                variant="outline"
                color="gray"
                >Cancel</UButton
              >
              <UButton @click="UpdateUser" variant="outline" color="green"
                >Submit</UButton
              >
            </div>
          </template>
        </UCard>
      </UModal>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "landing",
  middleware: ["auth", "admin"],
});

import axios from "axios";
import { ref, computed, watch, reactive } from "vue";

import exportFromJSON from "export-from-json";

const { data } = useAuth();

console.log("Logged in user", data.value);
const sort = ref({ column: "code", direction: "asc" });

const toast = useToast();
const comments = ref(null);

const selectedTab = ref(0);
const pageCount = ref(10);
const q = ref("");
const pending = ref(false);
const ShowMultipleActions = ref(false);

const isOpenRights = ref(false);
const isEditUser = ref(false);

const roles = [
  { id: 1, code: "ADMIN", description: "Admin" },
  { id: 2, code: "USER", description: "User" },
  { id: 3, code: "SETTLEMENT_GRC", description: "Settlement GRC" },
  { id: 4, code: "COUNTY_GRC", description: "County GRC" },
  { id: 5, code: "NATIONAL_GRC", description: "National GRC" },
  { id: 6, code: "GBV", description: "GBV" },
];

const checkedRoles = ref([]);

const filteredRows = computed(() => {
  if (!q.value) {
    return users.value;
  }
  return users.value.filter((user) => {
    return Object.values(user).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});

console.log("filteredRows", filteredRows);

const users = ref([]);
const columns = [
  {
    key: "id",
    label: "Id",
    sortable: true,
  },
  {
    key: "jina",
    label: "Name",
    sortable: true,
  },

  {
    key: "gender",
    label: "Gender",
    sortable: true,
  },

  {
    key: "phone",
    label: "Phone",
    sortable: true,
  },

  {
    key: "settlement",
    label: "Settlement",
    sortable: true,
  },
  {
    key: "actions",
  },
];

const page = ref(1);
const total = ref(0);
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed(() =>
  Math.min(page.value * pageCount.value, total.value)
);

 

onMounted(async () => {
  await onChange(0);
  getCounties()
});


async function onChange(index) {
  q.value = "";
  let status = "Resolved";
  pending.value = true;

  try {
    const response = await axios.post("/api/admin/users", {
      page: page.value, // Add page parameter
      pageCount: pageCount.value, // Add pageCount parameter
    });

    if (response.data.code === "0000") {
      //count[status] = response.data.data.length;
      total.value = response.data.total; // Update total value
      users.value = response.data.data;

      console.log("totalCount", response.data);
      
      pending.value = false;
      users.value = response.data.data.map(user => {
      const { name, ...rest } = user; // Extract the `name` property and the rest of the properties
      return {
        jina: name, // Rename `name` to `jina`
        ...rest // Include the rest of the properties unchanged
      };
    });


console.log("users.value", users.value);
    } else {
      console.log(response.data.message);
      toast.add({ title: response.data.message, color: "red" });
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    // Handle error, maybe show an error message to the user
  }
}

const onPageCountChange = async () => {
  // Call onChange function to fetch grievances with updated page count
  await onChange(selectedTab.value);
};

const onPageChange = async () => {
  // Call onChange function to fetch grievances with updated page count
  await onChange(selectedTab.value);
};

const downloadXLSX = () => {
  //downloadLoading.value = true
  const data = filteredRows.value;
  const fileName = "users";
  const exportType = exportFromJSON.types.csv;
  if (data) exportFromJSON({ data, fileName, exportType });
};

//// Grievnace Actions ////////////
//--------------------------------------------///

const selected = ref([]);
const selected_ids = ref([]);
const selected_rows = ref([]);

/// Send notification SMS/email later............
const sendNotification = async (msg) => {
  try {
    const response = await axios.post("/api/grievances/notification", {
      ids: selected_ids.value,
      message: msg, // Add page parameter
    });

    console.log(response);
  } catch (error) {
    console.error("Error during notification:", error.message);
    // Handle error, maybe show an error message to the user
  }
};

const selected_users = ref();
const allocateRights = async () => {
  console.log("AllocateRights", selected.value);
  selected_users.value = selected.value
    .map((person) => person.jina)
    .reduce((acc, curr, index, array) => {
      if (index === 0) {
        return curr;
      } else if (index === array.length - 1) {
        return `${acc} and ${curr}`;
      } else {
        return `${acc}, ${curr}`;
      }
    }, "");

  console.log("selected_users.value ", selected_users.value);

  isOpenRights.value = true;
};

const EditRights = async () => {
  const allocated_roles = [];

  console.log('selected_ids.value',selected_ids.value,)

  // Loop through objectsArray and append roles property
  selected_ids.value.forEach((obj) => {
    let obj_role = {};
    obj_role.id = obj;
    obj_role.roles = checkedRoles.value;
    allocated_roles.push(obj_role);
  });

  try {
    const response = await axios.post("/api/admin/rights", {
      ids: selected_ids.value,
      roles: checkedRoles.value,
    });

    console.log(response);

    if (response.data.success) {
      onChange(0);
      toast.add({ title: "Rights allocation is successful", color: "primary" });
      isOpenRights.value = false;
      showDetailsModal.value = false;
    } else {
      toast.add({ title: "Rights allocation  failed", color: "red" });
    }
    isOpen.value = false;
  } catch (error) {
    console.error("Error during allocation:", error.message);
    // Handle error, maybe show an error message to the user
  }
};

const UpdateUser = async () => {
  

  try {
    const response = await axios.post("/api/admin/user/update",user_details.value  );

    console.log(response);

    if (response.data.success) {
      onChange(0);
      toast.add({ title: "User update is successful", color: "primary" });
      isOpenRights.value = false;
     } else {
      toast.add({ title: "User update  failed", color: "red" });
    }
    isOpen.value = false;
  } catch (error) {
    console.error("Error during user udapte:", error.message);
    // Handle error, maybe show an error message to the user
  }
};

 
const deleteGrv = async () => {
  //downloadLoading.value = true
  console.log("deleteGrv....");

  try {
    const response = await axios.post("/api/grievances/delete", {
      ids: selected_ids.value,
      field: "status", // Add page parameter
      field_value: "Escalate", // Add pageCount parameter
    });

    console.log(response);
    if (response.data.success) {
      toast.add({ title: response.data.message, color: "primary" });
    } else {
      toast.add({ title: response.data.message, color: "red" });
    }

    selected_rows.value = [];
  } catch (error) {
    console.error("Error during login:", error.message);
    toast.add({ title: error.message, color: "red" });

    // Handle error, maybe show an error message to the user
  }
};

const actions = [
  [
    {
      label: "Allocate Rights",
      icon: "i-heroicons-document-arrow-up",
      click: () => {
        allocateRights();
      },
    },
    {
      label: "Suspend Accounts",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => {
        onInvestigate();
      },
    },
  ],
  [
    {
      label: "Reset Passwords",
      icon: "i-heroicons-check-badge",
      click: () => {
        // markResolved()
        isOpen.value = true;
      },
    },
  ],
  [
    {
      label: "Delete Users",
      icon: "i-heroicons-trash-20-solid",
      click: () => {
        deleteGrv();
      },
    },
  ],
];

// Watch for changes in the selected items
watch(selected, (newValue, oldValue) => {
  // newValue contains the updated selected items array
  // oldValue contains the previous selected items array
  console.log("Selected items changed:", newValue);

  if (newValue.length > 0) {
    ShowMultipleActions.value = true;

    selected_ids.value = newValue.map((obj) => obj.id);
    selected_rows.value = newValue.map((obj) => obj.code);

    console.log("Selected items changed:", selected_ids.value);
  } else {
    ShowMultipleActions.value = false;
  }
});

// Open Modal
const isOpen = ref(false);

/////////////-----------
const user_details = ref();
const getDetails = async (row) => {
  //downloadLoading.value = true
  console.log("getDetails....", row);
  showDetailsModal.value = true;
  user_details.value = row;
  checkedRoles.value = row.roles;
  selected_ids.value = [row._id];

  console.log("getDetails....", selected_ids.value );

};

const showUserModal = async (row) => {
  //downloadLoading.value = true
  console.log("user....", row);
  isEditUser.value = true;
 user_details.value = row;
 

/// change jina back to name 
 const { jina, ...rest } = user_details.value; // Replace 'oldPropertyName' with the actual property name you want to rename
  user_details.value = {
    name: jina, // Replace 'newPropertyName' with the new property name
    ...rest
  };


  console.log(" user_details.value2....",  user_details.value);



};

const items = (row) => [
  [
    {
      label: "Allocate Rights",
      icon: "i-heroicons-pencil-square-20-solid",

      click: () => {
        // markResolved()
        getDetails(row);
      },
    },
    {
      label: "Edit User",
      icon: "i-heroicons-user",

      click: () => {
        // markResolved()
        showUserModal(row);
      },
    },
  ],
];

const showDetailsModal = ref(false);



/// Editing user 
const form = reactive({
  username: '',
  password: '',
  name: '',
  phone: '',
  gender: '',
  county: '',
  subcounty: '',
  ward: '',
  settlement: '',
 
})

const counties = ref([])

async function getCounties() {
  let formData = { model: "county" };
  try {
    const response = await axios.post('https://ussd.ags.co.ke/admin', formData);
    console.log(response)
    const responseData = response.data.data;
    if (responseData) {
      // Assuming responseData is an array of objects with 'name' property
      const countyOptions = responseData.map(county => ({
        label: county.name, // Change 'name' to the actual property name from response data
        value: county.code // Change 'id' to the actual property name from response data
      }));

      countyOptions.sort((a, b) => a.value - b.value);

      console.log("County Options:", countyOptions);

      // Assuming you have a 'counties' variable defined as ref or reactive
      counties.value = countyOptions;
    }
  } catch (error) {
    console.error('Error fetching counties:', error.message);
  }
}
const subcounty_disabled=ref(true)
const ward_disabled=ref(true)
const settlements_disabled=ref(true)


const subcounties = ref([])
const selectedSubcounty =ref()

async function getSubCounties(parent) {
  subcounties.value=[]
  wards.value=[]
  settlements.value=[]

  let formData = { model: "subcounty", field: "county_id", filter_value:parseInt(parent) };
  try {
    const response = await axios.post('https://ussd.ags.co.ke/admin', formData);
 
    const responseData = response.data.data;
    if (responseData) {
      // Assuming responseData is an array of objects with 'name' property
      const adminOptions = responseData.map(admin => ({
        label: admin.name, // Change 'name' to the actual property name from response data
        value: admin.code // Change 'id' to the actual property name from response data
      }));

      adminOptions.sort((a, b) => a.value - b.value);

      console.log("admin Options:", adminOptions);
      subcounty_disabled.value=false

      // Assuming you have a 'counties' variable defined as ref or reactive
      subcounties.value = adminOptions;
    }
  } catch (error) {
    console.error('Error fetching counties:', error.message);
  }
}


const wards = ref([])

async function getWards(parent) {

  console.log("change subcounty >>,",parent)
  wards.value=[]
  settlements.value=[]

  let formData = { model: "ward", field: "subcounty_id", filter_value:parseInt(parent) };
  try {
    const response = await axios.post('https://ussd.ags.co.ke/admin', formData);
 
    const responseData = response.data.data;
    if (responseData) {
      // Assuming responseData is an array of objects with 'name' property
      const adminOptions = responseData.map(admin => ({
        label: admin.name, // Change 'name' to the actual property name from response data
        value: admin.code // Change 'id' to the actual property name from response data
      }));

      adminOptions.sort((a, b) => a.value - b.value);

      console.log("admin Options:", adminOptions);
      ward_disabled.value=false
      // Assuming you have a 'counties' variable defined as ref or reactive
      wards.value = adminOptions;
    }
  } catch (error) {
    console.error('Error fetching counties:', error.message);
  }
}

const settlements = ref([])
 
async function getSettlements(parent) {
 
  settlements.value=[]

  let formData = { model: "settlement", field: "ward_id", filter_value:parseInt(parent) };
  try {
    const response = await axios.post('https://ussd.ags.co.ke/admin', formData);
 
    const responseData = response.data.data;
    if (responseData) {
      // Assuming responseData is an array of objects with 'name' property
      const adminOptions = responseData.map(admin => ({
        label: admin.name, // Change 'name' to the actual property name from response data
        value: admin.code // Change 'id' to the actual property name from response data
      }));

      adminOptions.sort((a, b) => a.value - b.value);

      console.log("admin Options:", adminOptions);
      settlements_disabled.value=false

      // Assuming you have a 'counties' variable defined as ref or reactive
      settlements.value = adminOptions;
    }
  } catch (error) {
    console.error('Error fetching counties:', error.message);
  }
}


 const Gender = ['Male', 'Female' ]
 
 

</script>

<style scoped>
.el-table th {
  color: black;
}
</style>

<style scoped>
.checkbox-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  /* Adjust the gap between columns as needed */
}

.italic {
  font-style: italic;
}

.highlight {
  font-weight: bold;
  color: green;
  margin-bottom: 20px;
}
</style>
